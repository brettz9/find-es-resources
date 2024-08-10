import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    name: 'find-es-resources/ignores',
    ignores: [
      'docs',
      'output.js'
    ]
  },
  {
    name: 'find-es-resources/settings',
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
    }
  },
  ...ashNazg(['sauron', 'node']),
  {
    name: 'find-es-resources/markdown',
    files: ['*.md/*.js'],
    languageOptions: {
      globals: {
        filePath: true,
        esFileTraverseOptions: true,
        queryOptions: true,
        moduleString: true,
        getResourceStringsOutOfNode: true,
        getResourceStringsAlso: true
      }
    },
    rules: {
      'import/unambiguous': 'off',
      // 'import/no-unresolved': ['error', {
      //   ignore: ['find-es-resources']
      // }],
      'no-unused-vars': ['error', {varsIgnorePattern: 'arrayOfFileStrings'}],
      strict: 'off'
    }
  },
  {
    name: 'find-es-resources/rules',
    rules: {
      'n/no-unsupported-features/node-builtins': ['error', {
        ignores: ['fetch']
      }]
      // 'import/no-unresolved': ['error', {
      //   ignore: ['fs/promises']
      // }]
    }
  }
];
