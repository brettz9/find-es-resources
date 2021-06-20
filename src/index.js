import {readFile, writeFile} from 'fs/promises';

import path from 'path';

import {traverse as esFileTraverse} from 'es-file-traverse';
import esquery from 'esquery';
import cheerio from 'cheerio';
import globby from 'globby';

import css from 'css';

import queries from './queries.js';

/**
* @typedef {string} queryASTString
*/

/**
* @callback NodeValueRetriever
* @param {ASTNode} node
* @returns {string[]}
*/

/**
 * @param {Object<queryASTString,NodeValueRetriever>} _queries
 * @returns {{parsedQuery: ESQueryParsed, getPaths: NodeValueRetriever}[]}
 */
function parseQueries (_queries) {
  return Object.entries(_queries).map(([query, getPaths]) => {
    const parsedQuery = esquery.parse(query);
    return {parsedQuery, getPaths};
  });
}

const parsedQueries = parseQueries(queries);

/**
 * @external EsFileTraverseOptions
 * @see {@link https://github.com/brettz9/es-file-traverse}
 */

/**
 * @param {PlainObject} cfg
 * @param {string[]} cfg.input
 * @param {string[]} [cfg.htmlInput]
 * @param {string[]} [cfg.cssInput]
 * @param {string} [cfg.removeBasePath=""]
 * @param {string} [cfg.addBasePath=""]
 * @param {external:EsFileTraverseOptions} [cfg.esFileTraverseOptions]
 * @param {string} [cfg.queryModule]
 * @param {boolean} [cfg.noGlobs]
 * @param {booelan} [cfg.singleFiles]
 * @param {string} [cfg.cwd=process.cwd()]
 * @returns {Promise<string[]>}
 * @example
 * import workboxBuild from 'workbox-build';
 * import findESResources from 'find-es-resources';
 *
 * (async () => {
 * const additionalManifestEntries = await findESResources();
 *
 * // Also use https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-routing.NavigationRoute
 * //  for the sake of Single-Page-Application `replaceState`/`pushState` use.
 * // See also https://medium.com/@george.norberg/history-api-getting-started-36bfc82ddefc
 * return workboxBuild.generateSW({
 *   additionalManifestEntries,
 *   swDest: 'sw.js'
 * });
 * })();
 */
const findESResources = async ({
  input, htmlInput, cssInput, queryModule, noGlobs, singleFiles,
  cwd = process.cwd(),
  removeBasePath = '',
  addBasePath = '',
  esFileTraverseOptions = {}
} = {}) => {
  const esResources = new Set();
  let queryModuleResult;
  if (queryModule) {
    // eslint-disable-next-line no-unsanitized/method -- Runtime-specified
    queryModuleResult = (await import(
      path.resolve(
        process.cwd(),
        queryModule
      )
    )).default;
  }

  if (!input?.length) {
    const pkg = JSON.parse(
      await readFile(path.resolve(process.cwd(), './package.json'))
    );
    input = pkg?.exports?.browser;
  }

  if (input?.length) {
    const files = noGlobs
      ? input
      : await globby(input, {
        cwd
      });
    const filesArrs = await Promise.all(files.map((file) => {
      return esFileTraverse({
        node: true,
        ...esFileTraverseOptions,
        file,
        // excludePathExpression: '',
        callback (type, {ast, fullPath}) {
          if (type !== 'enter') {
            return;
          }

          const _parsedQueries = queryModuleResult
            ? [...parsedQueries, ...parseQueries(queryModuleResult)]
            : parsedQueries;

          _parsedQueries.forEach(({parsedQuery, getPaths}) => {
            esquery.traverse(
              ast,
              parsedQuery,
              async (node /* , parent, ancestry */) => {
                // console.log('node', node);
                (await getPaths(node, {fullPath})).forEach((result) => {
                  esResources.add(result);
                });
              }
            );
          });
        }
      });
    }));

    filesArrs.forEach((filesArr) => {
      // Imported source files themselves
      filesArr.forEach((_file) => {
        esResources.add(_file);
      });
    });
  }

  if (htmlInput?.length) {
    const htmlFileContents = await Promise.all(
      htmlInput.map(async (htmlInputString) => {
        const htmlPath = path.resolve(cwd, htmlInputString);
        return {
          htmlPath,
          html: await readFile(htmlPath)
        };
      })
    );

    htmlFileContents.forEach(({html, htmlPath}) => {
      // Add now for consistent ordering (processing synchronously)
      esResources.add(htmlPath);
      const $ = cheerio.load(html);
      [
        ['script[src]', 'src'],
        ['img[src]:not([src^="data:"])', 'src'],
        ['link[href]:not([href^="data:"])', 'href']
      ].forEach(([sel, attrib]) => {
        const elems = $(sel);
        // eslint-disable-next-line unicorn/no-for-loop -- Not iterable
        for (let i = 0; i < elems.length; i++) {
          esResources.add(
            path.resolve(path.dirname(htmlPath), elems[i].attribs[attrib])
          );
        }
      });
    });
  }

  if (cssInput?.length) {
    await Promise.all(cssInput.map(async (cssFile) => {
      esResources.add(path.resolve(cwd, cssFile));
      const cssContents = await readFile(cssFile, 'utf8');

      const {
        stylesheet: {rules}
      } = css.parse(cssContents);

      rules.forEach(({declarations}) => {
        declarations.forEach(({property, value}) => {
          // Todo: This only works if the properties use URLs and use single
          //  ones; filed https://github.com/reworkcss/css/issues/155
          if (![
            'background',
            'background-image',
            'border',
            'border-image',
            'border-image-source',
            'content',
            'cursor',
            'filter',
            'list-style',
            'list-style-image',
            'mask',
            'mask-image',
            'offset-path',
            'src', // @font-face
            'symbols' // @counter-style
          ].includes(property)) {
            return;
          }
          const url = value
            .replace(/^url\((?<quote>['"]?)(?<url>.*)\1?\)$/u, '$<url>')
            .replace(/^(?<quote>['"]?)(?<url>.*)\1?$/u, '$<url>');
          if (url.startsWith('data:')) {
            return;
          }
          esResources.add(path.resolve(cwd, url));
        });
      });

      return css;
    }));
  }

  let ret = [...esResources];

  if (removeBasePath || addBasePath) {
    ret = [...new Set(ret.map((item) => {
      return addBasePath + item.replace(removeBasePath, '');
    }))];
  }

  return ret.sort();
};

/**
 * @param {PlainObject} cfg
 * @param {string} cfg.output
 * @param {string[]} [cfg.input]
 * @param {string[]} [cfg.htmlInput]
 * @param {string[]} [cfg.cssInput]
 * @param {string} [cfg.removeBasePath=""]
 * @param {string} [cfg.addBasePath=""]
 * @param {external:EsFileTraverseOptions} [cfg.esFileTraverseOptions]
 * @param {string} [cfg.queryModule]
 * @param {boolean} [cfg.noGlobs]
 * @param {booelan} [cfg.singleFiles]
 * @param {string} [cfg.cwd=process.cwd()]
 * @returns {Promise<string[]>}
 */
const saveESResources = async ({
  output, input, htmlInput, cssInput, removeBasePath, addBasePath,
  esFileTraverseOptions, queryModule, noGlobs, singleFiles, cwd
}) => {
  const resources = await findESResources({
    input, htmlInput, cssInput, removeBasePath, addBasePath,
    esFileTraverseOptions, queryModule, noGlobs, singleFiles, cwd
  });
  await writeFile(
    output,
    output.endsWith('.js')
      ? 'export default ' + JSON.stringify(resources, null, 2) + ';\n'
      : JSON.stringify(resources, null, 2) + '\n'
  );
  return resources;
};

export {findESResources, saveESResources};
