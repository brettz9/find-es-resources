#!/usr/bin/env node

import {cliBasics} from 'command-line-basics';

import {findESResources, saveESResources} from '../src/index.js';

const optionDefinitions = await cliBasics(
  import.meta.dirname + '/../src/optionDefinitions.js',
  {
    packageJsonPath: import.meta.dirname + '/../package.json'
  }
);

if (!optionDefinitions) { // cliBasics handled
  // Apparently top-level-await creates the need for us to explicitly pass 0
  process.exit(0);
}

try {
  const method = optionDefinitions.output ? saveESResources : findESResources;
  const resources = await method(optionDefinitions);
  // eslint-disable-next-line no-console -- CLI
  console.log('Resource files', resources);
} catch (err) {
  // eslint-disable-next-line no-console -- Report error to user
  console.error(err);
  // Apparently top-level-await creates the need for us to explicitly pass 0
  process.exit(0);
}
