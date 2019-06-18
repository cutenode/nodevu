const request = require('request')
const api = require('../helpers/api')
const output = require('../helpers/output')

exports.command = 'latest [releaseLine]'

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
}

exports.handler = function (argv) {
  request(api.latest, function (error, response, body) {
    if (error) throw error

    const versions = JSON.parse(body)
    let releaseLine

    if (argv.releaseLine === undefined) {
      const keys = Object.keys(versions)
      const length = keys.length - 1
      releaseLine = keys[length]
    } else {
      releaseLine = argv.releaseLine.toString()
    }

    try {
      for (var v in versions) {
        if (releaseLine === v) {
          const message = {
            'text': `The latest release in the Node.js v${v} release line is ${versions[v]}`,
            'releaseLine': v,
            'release': versions[v],
            'status': 'success' // perhaps add an additional property that dynamically compares semver and returns the correct status message
          }

          if (argv.ci === true) {
            output(message, 'ci', message.status)
            return
          }

          if (argv.json === true) {
            output(message, 'json', 'success', message.status)
            return
          }

          return output(message.text, 'human', message.status)
        }
      }
    } catch (error) {
      output('Something\'s gone wrong. Please let @bnb know at https://github.com/cutenode/nanoprobe ❤️', 'human', 'error')
    }
  })
}
