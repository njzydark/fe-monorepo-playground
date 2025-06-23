#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const isESM = typeof require === 'undefined';
if (isESM) {
  import('../dist/bin/rstest.mjs');
} else {
  require('../dist/bin/rstest.js');
}
