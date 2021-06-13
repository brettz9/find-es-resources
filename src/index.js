import {readFile, writeFile} from 'fs/promises';

import path from 'path';

import {traverse as esFileTraverse} from 'es-file-traverse';
import esquery from 'esquery';
import cheerio from 'cheerio';

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
 * @param {string} cfg.input
 * @param {string} [cfg.htmlInput]
 * @param {string} [cfg.removeBasePath=""]
 * @param {string} [cfg.addBasePath=""]
 * @param {external:EsFileTraverseOptions} [cfg.esFileTraverseOptions]
 * @param {{queryModule: string}} [cfg.queryOptions={}]
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
  input, htmlInput, removeBasePath = '', addBasePath = '',
  esFileTraverseOptions = {}, queryOptions = {}
} = {}) => {
  const esResources = new Set();
  let queryModule;
  if (queryOptions.queryModule) {
    // eslint-disable-next-line no-unsanitized/method -- Runtime-specified
    queryModule = (await import(
      path.resolve(
        process.cwd(),
        queryOptions.queryModule
      )
    )).default;
  }

  if (!input) {
    const pkg = JSON.parse(
      await readFile(path.resolve(process.cwd(), './package.json'))
    );
    input = pkg?.exports?.browser;
  }

  if (input) {
    const filesArr = await esFileTraverse({
      node: true,
      ...esFileTraverseOptions,
      file: input,
      // excludePathExpression: '',
      callback (type, {ast}) {
        if (type !== 'enter') {
          return;
        }

        const _parsedQueries = queryModule
          ? [...parsedQueries, ...parseQueries(queryModule)]
          : parsedQueries;

        _parsedQueries.forEach(({parsedQuery, getPaths}) => {
          esquery.traverse(
            ast,
            parsedQuery,
            (node /* , parent, ancestry */) => {
              // console.log('node', node);
              getPaths(node).forEach((result) => {
                esResources.add(result);
              });
            }
          );
        });
      }
    });

    // Imported source files themselves
    filesArr.forEach((_file) => {
      esResources.add(_file);
    });
  }

  if (htmlInput) {
    const htmlPath = path.resolve(process.cwd(), htmlInput);
    esResources.add(htmlPath);
    const html = await readFile(htmlPath);
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
  }

  const ret = [...esResources];

  if (removeBasePath || addBasePath) {
    return [...new Set(ret.map((item) => {
      return addBasePath + item.replace(removeBasePath, '');
    }))];
  }

  return ret;
};

/**
 * @param {PlainObject} cfg
 * @param {string} cfg.output
 * @param {string} [cfg.input]
 * @param {string} [cfg.htmlInput]
 * @param {string} [cfg.removeBasePath=""]
 * @param {string} [cfg.addBasePath=""]
 * @param {external:EsFileTraverseOptions} [cfg.esFileTraverseOptions]
 * @param {{queryModule: string}} [cfg.queryOptions]
 * @returns {Promise<string[]>}
 */
const saveESResources = async ({
  output, input, htmlInput, removeBasePath, addBasePath,
  esFileTraverseOptions, queryOptions
}) => {
  const resources = await findESResources({
    input, htmlInput, removeBasePath, addBasePath,
    esFileTraverseOptions, queryOptions
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
