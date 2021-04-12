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

const fetchQuery = esquery.parse(
  'CallExpression:has(Identifier[name="fetch"])'
);

/**
 * @param {string} file
 * @returns {Promise<BuiltWorkboxInfo>}
 */
const findESResources = async (file) => {
  const esResources = [];
  const filesArr = await esFileTraverse({
    file,
    node: true,

    // excludePathExpression: '',
    callback (type, {ast}) {
      if (type !== 'enter') {
        return;
      }
      // Todo: Could bake into `es-file-traverse` a `traverse` here with
      //   `esquery.traverse.bind(esquery, ast)`
      esquery.traverse(
        ast,
        fetchQuery,
        // Todo: Document limitation that we aren't allowing a single
        //   dynamic variable that we follow everywhere
        (node /* , parent, ancestry */) => {
          console.log('pathArg.type', node);
          const pathArg = node.arguments[0];
          switch (pathArg.type) {
          /*
          case 'TemplateLiteral':
            // Todo: Grab multiple (unless a single)
            esResources.push();
            break;
          case 'BinaryExpression':
            // Todo: Grab multiple
            esResources.push();
            break;
          */
          case 'Literal':
            if (pathArg.name && esquery.matches(
              node,
              'CallExpression:has(MemberExpression.object[' +
              'type="ArrayExpression"]) > ArrowFunctionExpression > ' +
              'BlockStatement > ReturnStatement'
            )) {
              esquery.traverse(
                pathArg,
                'CallExpression:has(MemberExpression.object' +
                '[type="ArrayExpression"])',
                (nde) => {
                  nde.elements.forEach((element) => {
                    esResources.push(element.value);
                  });
                }
              );
              break;
            }
            esResources.push(pathArg.value);
            break;
          default:
            throw new Error(`Unexpected arg type: ${pathArg.type}`);
          }
        }
      );
    }
  });

  // Imported source files themselves
  esResources.push(...filesArr);

  return esResources;
};

module.exports = findESResources;
