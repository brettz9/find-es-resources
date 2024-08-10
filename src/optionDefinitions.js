import {readFile} from 'fs/promises';

const pkg = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url))
);

const JSONParser = JSON.parse.bind(JSON);

const getChalkTemplateSingleEscape = (s) => {
  return s.replaceAll(/[{}\\]/gu, (ch) => {
    return `\\u${ch.codePointAt().toString(16).padStart(4, '0')}`;
  });
};

// Todo: We really need a command-line-args-TO-typedef-jsdoc generator!
//  Might see about https://github.com/dsheiko/bycontract/
/* eslint-disable jsdoc/require-property -- Should get property from schema */
/**
* @typedef {object} PreassembledWorkerBoxesOptions
*/
/* eslint-enable jsdoc/require-property -- Should get property from schema */

const optionDefinitions = [
  {
    name: 'output', type: String, alias: 'o',
    defaultOption: true,
    description: 'File to which to save the output. Required.',
    typeLabel: '{underline file path}'
  },
  {
    name: 'input', type: String, alias: 'i', multiple: true,
    description: 'Input file. Will default to checking `exports.browser`.',
    typeLabel: '{underline path to input file}'
  },
  {
    name: 'noGlobs', type: Boolean,
    description: '`input` files will be treated by default as globs. Set ' +
      'this to `true` to disable. Defaults to `false`.'
  },
  {
    name: 'singleFiles', type: Boolean,
    description: 'Set to `true` to avoid traversing import chain. Defaults ' +
      'to `false`.'
  },
  {
    name: 'cwd', type: String,
    description: 'Current working directory; defaults to `process.cwd()`',
    typeLabel: '{underline path}'
  },
  {
    name: 'htmlInput', type: String, multiple: true,
    description: 'HTML input file. `link[href]`, `img[src]`, and ' +
      '`script[src]` will be checked in addition to adding the HTML file ' +
      'itself.',
    typeLabel: '{underline path to HTML input file}'
  },
  {
    name: 'cssInput', type: String, multiple: true,
    description: 'CSS input file. URL fields will be checked in addition ' +
      'to adding the CSS file itself.',
    typeLabel: '{underline path to CSS input file}'
  },
  {
    name: 'removeBasePath', type: String,
    description: 'Base path used to strip off a full file path.',
    typeLabel: '{underline path}'
  },
  {
    name: 'addBasePath', type: String,
    description: 'URL base path added on to path (after any ' +
      '`removeBasePath`).',
    typeLabel: '{underline path}'
  },
  {
    name: 'esFileTraverseOptions', type: JSONParser,
    description: 'Options to pass to `es-file-traverse`. Note that `file` ' +
      'and `callback` on this object have no effect. Defaults to ' +
      getChalkTemplateSingleEscape(
        '`{"node": "true"}`'
      ) +
      ' and use of our main `file` and a special `callback`.',
    typeLabel: '{underline JSON object string}'
  },
  {
    name: 'queryModule', type: String,
    description: 'Note that any items discovered on the object returned by ' +
      'the requiring of the `queryModule` module will be merged onto the ' +
      'built-in queries of `find-es-resources`.',
    typeLabel: '{underline JSON object string}'
  }
];

const cliSections = [
  {
    // Add italics: `{italic textToItalicize}`
    content: pkg.description +
      '\n\n{italic find-es-resources --input path/to/file.js ' +
        '--output path/to/file.js}'
  },
  {
    optionList: optionDefinitions
  }
];

export {optionDefinitions as definitions, cliSections as sections};
