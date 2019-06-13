const request = require('request')
const chalk = require('chalk')
const semver = require('semver')
const api = require('../helpers/api')
const logger = require('../helpers/logger')
const output = require('../helpers/output')

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
  request(api.data, function(error, response, body) {
    if (error) throw error

    const data = JSON.parse(body) // parse the remote JSON so we can use it
    const versionToCheck = argv.version === undefined ? process.version : semver.valid(semver.coerce(argv.version)) // use the passed version if there is one, but otherwise default to the system's current version.
    const safe = check(data, versionToCheck) // call the check method, which loops over the version and returns an object that has the data we need to build out our message

    try {
      if(safe.isVulnerable === true) {
        const sanitizedSafe = {
          isVulnerable: safe.isVulnerable,
          securityReleasesSinceCurrent: safe.vulnerableVersions,
          securityReleaseNotesSinceCurrent: safe.blogLinks
        }

        const message = {
          'text': `Node.js ${versionToCheck} is not safe.\n\nSecurity releases since ${chalk.yellow(versionToCheck)}: ${chalk.red(safe.vulnerableVersionsHumanReadable)}\n\nYou can find the relevant release notes and vulnerability information in the following link(s):\n\n${chalk.blue(safe.blogLinksHumanReadableWithNewLines)}`,
          'textPlain': `You're running a vulnerable version of Node.js. Security release(s) since ${versionToCheck}: ${safe.vulnerableVersionsHumanReadable}. You can find the relevant release notes and vulnerability information in the following link(s):\n\n${safe.blogLinksHumanReadableWithNewLines}`,
          'status': 'error' // perhaps add an additional property that dynamically compares semver and returns the correct status message
        }

        if(argv.json === true) {
          output(sanitizedSafe, 'json', message.status)
          return
        }
  
        if(argv.ci === true) {
          output(sanitizedSafe, 'ci', message.status)
          return
        }
  
        if(argv.plain === true) {
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

        if(argv.json === true) {
          output(sanitizedSafe, 'json', message.status)
          return
        }
  
        if(argv.ci === true) {
          output(sanitizedSafe, 'ci', message.status)
          return
        }
  
        if(argv.plain === true) {
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

function check (obj, valueToCompare) {
  const result = { // instantiate the object we want to return. All types should remain the same.
    isVulnerable: false,
    vulnerableVersions: [],
    vulnerableVersionsHumanReadable: '',
    blogLinks: [],
    blogLinksHumanReadable: '',
    blogLinksHumanReadableWithNewLines: ''
  }


  for(var version in obj) {
    if(obj[version].metadata.security === true) { // checka Node.js metadata to see if the release is indeed a security release.
      try {
        if(semver.lt(valueToCompare, obj[version].version) === true) {
          const iteratedVersion = obj[version].version
          result.isVulnerable = true
          result.vulnerableVersions.push(semver.clean(iteratedVersion))
          result.blogLinks.push(`https://nodejs.org/en/blog/release/v${semver.clean(iteratedVersion)}/`)
        }
      } catch (error) {
        process.exit(output('Something was wrong with the semver value you passed! Make sure you\'re using a valid semver number.If you\'re trying a major or major and minor, make sure you\'re including a v, like v12 or v8.6', 'human', 'error'))
      }
    }
  }

  result.vulnerableVersionsHumanReadable = result.vulnerableVersions.join(', ')
  result.blogLinksHumanReadable = result.blogLinks.join(', ')
  result.blogLinksHumanReadableWithNewLines = result.blogLinks.join('\n')

  return result
}