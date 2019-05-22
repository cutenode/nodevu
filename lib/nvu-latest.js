const request = require('request')
const api = require('./api')
const logger = require('./helpers/logger')

exports.command = 'latest [releaseLine]'

exports.describe = 'List the latest versions of Node.js'

exports.handler = function (argv) {
  request(api.latest, function(error, response, body) {
    if (error) throw error
    
    const versions = JSON.parse(body)
    let releaseLine 
    
    if(argv.releaseLine === undefined) {
      const keys = Object.keys(versions)
      const length = keys.length - 1
      releaseLine = keys[length]
    } else {
      releaseLine = argv.releaseLine.toString()
    }

    try {
      for (var v in versions) {
        if(releaseLine === v) {
          
          const message = `The latest release in the Node.js v${v} release line is ${versions[v]}`
          logger(message, 'info')
        }
      }
    } catch {
      logger('Something\'s gone wrong. Please let @bnb know at https://github.com/bnb/nvu ❤️', 'error')
    }
  })
}