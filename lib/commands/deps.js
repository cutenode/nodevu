const request = require('request')
const chalk = require('chalk')
const semver = require('semver')
const api = require('../helpers/api')
const handler = require('../helpers/commandHandler')

exports.command = 'deps [version]'

exports.describe = 'Expose the versions of Node.js\'s dependencies at a specific version. Defaults to the latest version in an incomplete semver string.'

exports.builder = function (yargs) {
  return yargs.usage('nanoprobe deps <version>')
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
  request(api.data, function (error, response, body) {
    if (error) throw error

    const data = JSON.parse(body)
    const versionToCheck = argv.version === undefined ? process.version : semver.valid(semver.coerce(argv.version.toString())) // use the passed version if there is one, but otherwise default to the system's current version.
    // TODO: this currently errors if process.version is used
    const entry = check(data, 'v' + versionToCheck)

    const jsonExport = { // define this as a variable since it's a more concise approach to both the human readable outputs and can also just be directly returned for JSON
      npm: data[entry].metadata.npm,
      v8: data[entry].metadata.v8,
      libuv: data[entry].metadata.libuv,
      openssl: data[entry].metadata.openssl
    }

    const message = {
      'text': `\n  Dependencies for the Node.js ${versionToCheck}:\n  - ${chalk.red('npm:')} ${jsonExport.npm}\n  - ${chalk.blue('V8:')} ${jsonExport.v8}\n  - ${chalk.green('libuv:')} ${jsonExport.libuv}\n  - ${chalk.magenta('OpenSSL:')} ${jsonExport.openssl}`,
      'textPlain': `Dependencies for the Node.js ${versionToCheck}: npm@${jsonExport.npm}, V8@${jsonExport.v8}, libuv@${jsonExport.libuv}, OpenSSL@${jsonExport.openssl}`,
      'json': jsonExport,
      'status': 'none' // perhaps add an additional property that dynamically compares semver and returns the correct status message
    }

    const flagOptions = {
      'json': true,
      'ci': false,
      'plain': true
    }

    handler(argv, message, flagOptions)
  })
}

function check (obj, valueToCompare) {
  for (var entry in obj) {
    if (obj[entry].version === valueToCompare) {
      return entry
    }
  }
}
