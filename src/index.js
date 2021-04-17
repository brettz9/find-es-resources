'use strict';

// Todo: Add this to binary and move to own library
/**
 * @example
'use strict';
const workboxBuild = require('workbox-build');
const findESResources = require('find-es-resources');

(async () => {
const additionalManifestEntries = await findESResources('...file...');

// Also use https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-routing.NavigationRoute
//  for the sake of Single-Page-Application `replaceState`/`pushState` use.
// See also https://medium.com/@george.norberg/history-api-getting-started-36bfc82ddefc
return workboxBuild.generateSW({
  additionalManifestEntries,
  swDest: 'sw.js'
});
})();
 */

const {traverse: esFileTraverse} = require('es-file-traverse');
const esquery = require('esquery');

/**
 * See {@link https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.getManifest}.
 * @typedef {PlainObject} BuiltWorkboxInfo
 * @property {number} count
 * @property {string[]} filePaths
 * @property {number} size
 * @property {string[]} warnings
 */

const queries = {
  // Todo: For `TemplateLiteral`, grab multiple (unless a single)
  // Todo: For `BinaryExpression`, grab multiple
  // Todo: Handle plain `Identifier` inside array
  // Todo: Handle `Literal`

  // Array expression to get at `elements`
  [
  // `callee` -> `MemberExpression.object.ArrayExpression`
  // `arguments` -> `ArrowFunctionExpression`
  'CallExpression:matches(' +
    '[callee.type="MemberExpression"]' +
    '[callee.object.type="ArrayExpression"]' +
    '[arguments.0.type="ArrowFunctionExpression"]' +
    '[arguments.0.body.type="BlockStatement"]' +
    '[arguments.0.body.body.0.type="ReturnStatement"]' +
    '[arguments.0.body.body.0.argument.type="CallExpression"]' +
    '[arguments.0.body.body.0.argument.callee.type="Identifier"]' +
    '[arguments.0.body.body.0.argument.callee.name="fetch"]' +
  ') > MemberExpression > ArrayExpression'
  ] (node) {
    return node.elements.map((element) => {
      return element.value;
    });
  }
};

const parsedQueries = Object.entries(queries).map(([query, method]) => {
  const parsedQuery = esquery.parse(query);
  return {parsedQuery, method};
});

/**
 * @param {string} file
 * @returns {Promise<BuiltWorkboxInfo>}
 */
const findESResources = async (file) => {
  const esResources = new Set();
  const filesArr = await esFileTraverse({
    file,
    node: true,

    // excludePathExpression: '',
    callback (type, {ast}) {
      if (type !== 'enter') {
        return;
      }

      parsedQueries.forEach(({parsedQuery, method}) => {
        esquery.traverse(
          ast,
          parsedQuery,
          (node /* , parent, ancestry */) => {
            // console.log('node', node);
            method(node).forEach((result) => {
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
