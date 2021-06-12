import {join, dirname} from 'path';

import {fileURLToPath} from 'url';

import {findESResources} from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} file
 * @returns {string}
 */
function getFixturePath (file) {
  return join(__dirname, 'fixtures', file);
}

describe('findESResources', function () {
  it('Finds resources (no imports)', async function () {
    const resources = await findESResources({
      input: getFixturePath('fetches.js')
    });
    expect(resources).to.have.lengthOf(3);
    expect(resources).to.include.members([
      './test1.json',
      './test2.json'
    ]);
    expect(resources[2]).to.match(/test\/fixtures\/fetches\.js/u);
  });

  it('Finds resources (base paths)', async function () {
    const resources = await findESResources({
      input: getFixturePath('fetches.js'),
      addBasePath: '/basePath/',
      removeBasePath: './'
    });
    expect(resources).to.have.lengthOf(3);
    expect(resources).to.include.members([
      '/basePath/test1.json',
      '/basePath/test2.json'
    ]);
    expect(resources[2]).to.match(/test\/fixtures\/fetches\.js/u);
  });

  it('Finds resources (single import)', async function () {
    const resources = await findESResources({
      input: getFixturePath('importer.js')
    });
    expect(resources).to.have.lengthOf(4);
    expect(resources).to.include.members([
      './test1.json',
      './test2.json'
    ]);
    expect(resources[2]).to.match(/test\/fixtures\/importer\.js/u);
    expect(resources[3]).to.match(/test\/fixtures\/fetches\.js/u);
  });

  it('Finds resources (queryModule)', async function () {
    const resources = await findESResources({
      input: getFixturePath('file-with-custom-items.js'),
      queryOptions: {
        queryModule: './test/fixtures/queryModule.js'
      }
    });
    expect(resources).to.have.lengthOf(4);
    expect(resources).to.include.members([
      './test1.json',
      './test2.json',
      './test7.json'
    ]);
    expect(resources[3]).to.match(/test\/fixtures\/file-with-custom-items\.js/u);
  });
});
