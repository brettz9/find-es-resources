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

  it('Finds HTML resources', async function () {
    const resources = await findESResources({
      htmlInput: getFixturePath('index.html')
    });
    expect(resources).to.have.lengthOf(7);
    expect(resources[0]).to.have.string('image1.png');
    expect(resources[1]).to.have.string('image2.png');
    expect(resources[2]).to.match(/test\/fixtures\/index\.html/u);
    expect(resources[3]).to.have.string('script1.js');
    expect(resources[4]).to.have.string('script2.js');
    expect(resources[5]).to.have.string('stylesheet1.css');
    expect(resources[6]).to.have.string('stylesheet2.css');
  });

  it('Finds CSS URLs', async function () {
    const resources = await findESResources({
      cssInput: [getFixturePath('index.css')]
    });
    expect(resources).to.have.lengthOf(3);
    expect(resources[0]).to.have.string('/test/fixtures/index.css');
    expect(resources[1]).to.have.string('/icons/openWindow24.png');
    expect(resources[2]).to.have.string('/images/hello.png');
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
    expect(resources[0]).to.match(/test\/fixtures\/fetches\.js/u);
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
    expect(resources[2]).to.match(/test\/fixtures\/fetches\.js/u);
    expect(resources[3]).to.match(/test\/fixtures\/importer\.js/u);
  });

  it('Finds resources (queryModule)', async function () {
    const resources = await findESResources({
      input: getFixturePath('file-with-custom-items.js'),
      queryModule: './test/fixtures/queryModule.js'
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
