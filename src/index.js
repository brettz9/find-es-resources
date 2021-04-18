'use strict';

// Todo: Adapt this example code into a binary as part of its own library
/**
 * @example
 * 'use strict';
 * const workboxBuild = require('workbox-build');
 * const findESResources = require('find-es-resources');
 *
 * (async () => {
 * const additionalManifestEntries = await findESResources('...file...');
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

const {traverse: esFileTraverse} = require('es-file-traverse');
const esquery = require('esquery');

const queries = require('./queries.js');

/**
 * See {@link https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.getManifest}.
 * @typedef {PlainObject} BuiltWorkboxInfo
 * @property {number} count
 * @property {string[]} filePaths
 * @property {number} size
 * @property {string[]} warnings
 */

const parsedQueries = Object.entries(queries).map(([query, getPaths]) => {
  const parsedQuery = esquery.parse(query);
  return {parsedQuery, getPaths};
});

/**
 * @external EsFileTraverseOptions
 * @see {@link https://github.com/brettz9/es-file-traverse}
 */

/**
 * @param {string} file
 * @param {external:EsFileTraverseOptions} esFileTraverseOptions
 * @returns {Promise<BuiltWorkboxInfo>}
 */
const findESResources = async (file, esFileTraverseOptions) => {
  const esResources = new Set();
  const filesArr = await esFileTraverse({
    node: true,
    ...esFileTraverseOptions,
    file,
    // excludePathExpression: '',
    callback (type, {ast}) {
      if (type !== 'enter') {
        return;
      }

      parsedQueries.forEach(({parsedQuery, getPaths}) => {
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

  return [...esResources];
};

module.exports = findESResources;
