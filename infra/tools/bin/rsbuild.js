#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const isESM = typeof require === 'undefined'
if (isESM) {
  import('../dist/bin/rsbuild.mjs')
} else {
  require('../dist/bin/rsbuild.js')
}
