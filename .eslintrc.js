'use strict';

module.exports = {
  root: true,
  extends: ['ash-nazg/sauron-node-script-overrides'],
  settings: {
    polyfills: [
      'console',
      'Error',
      'fetch',
      'Object.entries',
      'Promise.all',
      'Set'
    ]
  },
  overrides: [
    {
      files: '*.md/*.js',
      globals: {
        findESResources: true,
        filePath: true,
        esFileTraverseOptions: true,
        queryOptions: true,
        moduleString: true,
        getResourceStringsOutOfNode: true,
        getResourceStringsAlso: true
      },
      rules: {
        'no-unused-vars': ['error', {varsIgnorePattern: 'arrayOfFileStrings'}],
        strict: 'off'
      }
    },
    {
      files: 'test/fixtures/**',
      extends: ['ash-nazg/sauron-node-overrides']
    },
    {
      files: 'test/fixtures/queryModule.js',
      extends: ['ash-nazg/sauron-node-script-overrides']
    }
  ],
  env: {
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
  }
};
