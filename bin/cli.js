#!/usr/bin/env node

const yargs = require('yargs') // eslint-disable-line no-unused-vars
  .scriptName('nvu')
  .usage('nvu [command] [args]')
  .command(require('../lib/nvu-latest'))
  .argv