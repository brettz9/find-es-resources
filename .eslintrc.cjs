'use strict';

module.exports = {
  root: true,
  extends: ['ash-nazg/sauron-node-overrides'],
  settings: {
    polyfills: [
      'console',
      'Error',
      'fetch',
      'Object.entries',
      'Promise.all',
      'Set',
      'URL'
    ]
  },
  overrides: [
    {
      files: '*.md/*.js',
      parserOptions: {
        sourceType: 'module'
      },
      globals: {
        filePath: true,
        esFileTraverseOptions: true,
        queryOptions: true,
        moduleString: true,
        getResourceStringsOutOfNode: true,
        getResourceStringsAlso: true
      },
      rules: {
        'import/unambiguous': 'off',
        'import/no-unresolved': ['error', {
          ignore: ['find-es-resources']
        }],
        'no-unused-vars': ['error', {varsIgnorePattern: 'arrayOfFileStrings'}],
        strict: 'off'
      }
    },
    {
      files: 'test/fixtures/**',
      extends: ['ash-nazg/sauron-node-overrides']
    }
  ],
  env: {
    es6: true
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021
  },
  rules: {
    'import/no-unresolved': ['error', {
      ignore: ['fs/promises']
    }]
  }
};
