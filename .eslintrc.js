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
      rules: {
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
