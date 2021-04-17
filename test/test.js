'use strict';

const {join} = require('path');

const findESResources = require('../src/index.js');

/**
 * @param {string} file
 * @returns {string}
 */
function getFixturePath (file) {
  return join(__dirname, 'fixtures', file);
}

describe('findESResources', function () {
  it('Finds resources', async function () {
    const resources = await findESResources(getFixturePath('fetches.js'));
    expect(resources).to.include.members([
      './test1.json',
      './test2.json'
    ]);
    expect(resources[2]).to.match(/test\/fixtures\/fetches\.js/u);
  });
});
