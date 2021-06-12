#!/usr/bin/env node

import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

import {cliBasics} from 'command-line-basics';

import {saveESResources} from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const optionDefinitions = await cliBasics(
  join(__dirname, '../src/optionDefinitions.js')
);

if (!optionDefinitions) { // cliBasics handled
  // Apparently top-level-await creates the need for us to explicitly pass 0
  process.exit(0);
}

try {
  const resources = await saveESResources(optionDefinitions);
  // eslint-disable-next-line no-console -- CLI
  console.log('Resource files', resources);
} catch (err) {
  // eslint-disable-next-line no-console -- Report error to user
  console.error(err);
  // Apparently top-level-await creates the need for us to explicitly pass 0
  process.exit(0);
}
