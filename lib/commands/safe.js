const request = require('request')
const chalk = require('chalk')
const semver = require('semver')
const api = require('../helpers/api')
const logger = require('../helpers/logger')
const output = require('../helpers/output')
const check = require('../helpers/safety-check')

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
    const majorOfVersionToCheck = semver.major(versionToCheck) // get the semver major so we can write that out to our messages
    const safe = check(data, versionToCheck) // call the check method, which loops over the version and returns an object that has the data we need to build out our message

    try {
      if (safe.isVulnerable === true) {
        const message = {
          'text': `Node.js ${versionToCheck} is not safe.\n\nSecurity release(s) in the Node.js v${majorOfVersionToCheck} release line since ${chalk.yellow(versionToCheck)}: ${chalk.red(safe.vulnerableVersionsHumanReadable)}\n\nYou can find the relevant release notes and vulnerability information in the following link(s):\n\n${chalk.blue(safe.blogLinksHumanReadableWithNewLines)}`,
          'textPlain': `Node.js ${versionToCheck} is not safe. Security release(s) in the Node.js v${majorOfVersionToCheck} release line since ${versionToCheck}: ${safe.vulnerableVersionsHumanReadable}. You can find the relevant release notes and vulnerability information in the following link(s):\n\n${safe.blogLinksHumanReadableWithNewLines}`,
          'json': {
            isVulnerable: safe.isVulnerable,
            securityReleasesSinceCurrent: safe.vulnerableVersions,
            securityReleaseNotesSinceCurrent: safe.blogLinks
          },
          'status': 'error' // perhaps add an additional property that dynamically compares semver and returns the correct status message
        }

        if (argv.json === true) {
          output(message.json, 'json', message.status)
          return
        }

        if (argv.ci === true) {
          output({}, 'ci', message.status) // empty object since this doesn't actually output anything
          return
        }

        if (argv.plain === true) {
          output(message.textPlain, 'human', message.status)
          return
        }
        return output(message.text, 'human', message.status)
      } else {
        const sanitizedSafe = {
          isVulnerable: safe.isVulnerable,
          securityReleasesSinceCurrent: safe.vulnerableVersions,
          securityReleaseNotesSinceCurrent: safe.blogLinks
        }

        const message = {
          'text': `There are currently no patched vulnerabilities that affect ${chalk.green(versionToCheck)}.`,
          'textPlain': `There are currently no patched vulnerabilities that affect ${versionToCheck}.`,
          'status': 'success' // perhaps add an additional property that dynamically compares semver and returns the correct status message
        }

        if (argv.json === true) {
          output(sanitizedSafe, 'json', message.status)
          return
        }

        if (argv.ci === true) {
          output(sanitizedSafe, 'ci', message.status)
          return
        }

        if (argv.plain === true) {
          output(message.textPlain, 'human', message.status)
          return
        }
        return output(message.text, 'human', message.status)
      }
    } catch (error) {
      logger(`The version you input to check (${versionToCheck}) was invalid. Try again?`, 'error')
    }
  })
}
