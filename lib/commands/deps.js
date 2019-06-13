const request = require('request')
const chalk = require('chalk')
const api = require('../helpers/api')
const logger = require('../helpers/logger')
const output = require('../helpers/output')

exports.command = 'deps <version>'

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
  request(api.data, function(error, response, body) {
    if (error) throw error

    const data = JSON.parse(body)
    const versionToCheck = argv.version
    const entry = check(data, versionToCheck)

    try { 
      const dependencies = {
        npm: data[entry].metadata.npm,
        v8: data[entry].metadata.v8,
        libuv: data[entry].metadata.libuv,
        openssl: data[entry].metadata.openssl
      }

      const message = { 
        'text': `\n  Dependencies for the Node.js v${versionToCheck}:\n  - ${chalk.red('npm:')} ${dependencies.npm}\n  - ${chalk.blue('V8:')} ${dependencies.v8}\n  - ${chalk.green('libuv:')} ${dependencies.libuv}\n  - ${chalk.magenta('OpenSSL:')} ${dependencies.openssl}`,
        'textPlain': `Dependencies for the Node.js v${versionToCheck}: npm@${dependencies.npm}, V8@${dependencies.v8}, libuv@${dependencies.libuv}, OpenSSL@${dependencies.openssl}`,
        'versions': dependencies,
        'status': 'none' // perhaps add an additional property that dynamically compares semver and returns the correct status message
      }

      if(argv.json === true) {
        output(dependencies, 'json', message.status)
        return
      }

      if(argv.plain === true) {
        output(message.textPlain, 'human', message.status)
        return
      }

      return output(message.text, 'human', message.status)
    } catch (error) {
      logger(`The version you input to check (${versionToCheck}) was invalid. Try again?`, 'error')
    }
  })
}

function check (obj, valueToCompare) {
  for (var entry in obj) {
    if(obj[entry].version === `v${valueToCompare}`) {
      return entry
    }
  }
}