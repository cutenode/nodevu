#!/usr/bin/env node
const chalk = require('chalk')

const yargs = require('yargs') // eslint-disable-line no-unused-vars
  .scriptName('nanoprobe')
  .usage('nanoprobe [command] [args]')
  .commandDir('../lib/commands/')
  .help('h')
  .alias('h', 'help')
  .strict()
  .recommendCommands()
  .option('v', {
    alias: 'version',
    global: false,
    type: 'boolean',
    describe: 'Show the current version of nanoprobe',
    skipValidation: true
  })
  .fail(function (msg, err, yargs) {
    if (err) throw err
    console.error(chalk.red('Something isn\'t quite right...'))
    console.error()
    console.error(yargs.help())
    console.error()
    console.error(chalk.red(msg))
    process.exit(1)
  })
  .argv

