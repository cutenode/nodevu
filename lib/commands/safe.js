const request = require('request')
const chalk = require('chalk')
const semver = require('semver')
const api = require('../helpers/api')
const check = require('../helpers/safety-check')
const handler = require('../helpers/commandHandler')

exports.command = 'safe [version]'

exports.describe = 'Lets  you know whether or not you are running a version of Node.js with zero known vulnerabilities'

// Builds out command flags and descriptions
exports.builder = function (yargs) {
  return yargs.usage('nanoprobe safe [version]')
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
  request(api.data, function (error, response, body) {
    if (error) throw error

    const data = JSON.parse(body) // parse the remote JSON so we can use it
    const versionToCheck = argv.version === undefined ? process.version : semver.valid(semver.coerce(argv.version)) // use the passed version if there is one, but otherwise default to the system's current version.
    const safe = check(data, versionToCheck) // call the check method, which loops over the version and returns an object that has the data we need to build out our message

    const flagOptions = { // put outside of the if scope so both if and else calls to handler can use them
      'json': true,
      'ci': true,
      'plain': true
    }

    const jsonExport = { // the JSON object to resolve if the --json flag is passed
      isVulnerable: safe.isVulnerable,
      securityReleasesSinceCurrent: safe.vulnerableVersions,
      securityReleaseNotesSinceCurrent: safe.blogLinks
    }

    if (safe.isVulnerable === true) {
      const message = {
        'text': `Node.js ${versionToCheck} is not safe.\n\nSecurity release(s) in the Node.js v${semver.major(versionToCheck)} release line since ${chalk.yellow(versionToCheck)}: ${chalk.red(safe.vulnerableVersionsHumanReadable)}\n\nYou can find the relevant release notes and vulnerability information in the following link(s):\n\n${chalk.blue(safe.blogLinksHumanReadableWithNewLines)}`, // the string to log if no specical flag is passed
        'textPlain': `Node.js ${versionToCheck} is not safe. Security release(s) in the Node.js v${semver.major(versionToCheck)} release line since ${versionToCheck}: ${safe.vulnerableVersionsHumanReadable}. You can find the relevant release notes and vulnerability information in the following link(s):\n\n${safe.blogLinksHumanReadableWithNewLines}`, // the string to log if the --plain flag is passed
        'json': jsonExport,
        'error': `The version you input to check (${versionToCheck}) was invalid. Try again?`, // The message to resolve if an error occurs.
        'status': 'error' // perhaps add an additional property that dynamically compares semver and returns the correct status message
      }

      handler(argv, message, flagOptions)
    } else {
      const message = {
        'text': `There are currently no patched vulnerabilities that affect ${chalk.green(versionToCheck)}.`,
        'textPlain': `There are currently no patched vulnerabilities that affect ${versionToCheck}.`,
        'json': jsonExport,
        'error': `The version you input to check (${versionToCheck}) was invalid. Try again?`,
        'status': 'success' // perhaps add an additional property that dynamically compares semver and returns the correct status message
      }

      handler(argv, message, flagOptions)
    }
  })
}
