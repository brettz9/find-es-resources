'use strict';

module.exports = {
  root: true,
  extends: ['ash-nazg/sauron-node-script-overrides'],
  settings: {
    polyfills: [
      'console',
      'Error',
      'fetch',
      'Promise.all'
    ]
  },
  overrides: [
    {
      files: '*.md/*.js',
      rules: {
        strict: 'off'
      }
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
