const semver = require('semver')
const request = require('request')
const chalk = require('chalk')
const handler = require('../helpers/commandHandler')
const output = require('../helpers/output')
const api = require('../helpers/api')

exports.command = 'latest [version]'

exports.describe = 'List the latest versions of Node.js'

exports.builder = function (yargs) {
  return yargs
    .usage('nanoprobe latest')
    .option('ci', {
      alias: 'c',
      demandOption: false,
      default: false,
      describe: 'Run and only exit the process with a 0 or 1 result.',
      type: 'boolean'
    })
    .option('json', {
      alias: 'j',
      demandOpton: false,
      default: false,
      describe: 'Return JSON rather than a human-readable CLI output.',
      type: 'boolean'
    })
    .option('plain', {
      alias: 'p',
      demandOpton: false,
      default: false,
      describe: 'Return a plaintext answer rather than a fancy (default) one.',
      type: 'boolean'
    })
}

exports.handler = function (argv) {
  request(api.latest, function (error, response, body) {
    if (error) throw error

    const versions = JSON.parse(body)
    let releaseLine = argv.version === undefined ? process.version : semver.major(semver.valid(semver.coerce(argv.version)))

    for (var v in versions) {
      const flagOptions = {
        'json': true,
        'ci': false,
        'plain': true
      }

      const jsonExport = {
        'releaseLine': v,
        'release': versions[v]
      }

      const message = {
        'text': `The latest release in the Node.js ${chalk.blue('v' + v + '.x')} release line is ${chalk.green(versions[v])}`, // the string to log if no specical flag is passed
        'textPlain': `The latest release in the Node.js v${v}.x release line is ${versions[v]}`, // the string to log if the --plain flag is passed
        'json': jsonExport,
        'error': `Something's gone wrong. Please let @bnb know at https://github.com/cutenode/nanoprobe ❤️`, // The message to resolve if an error occurs.
        'status': 'info' // perhaps add an additional property that dynamically compares semver and returns the correct status message
      }

      if (releaseLine.toString() === v) {
        return handler(argv, message, flagOptions)
      }
    }

    return output('The version of Node.js you passed does not exist. Double check that the release line you\'re passing is a valid semver major Node.js release line.', 'human', 'error')
  })
}
