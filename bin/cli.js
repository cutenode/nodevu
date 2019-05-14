#!/usr/bin/env node
// @ts-check

const request = require('request')
const symbols = require('log-symbols')

const apiBase = 'https://nodev.azurewebsites.net/api/'

const api = {
  latest: apiBase + 'latest.json',
  data: apiBase + 'data.json',
  new: apiBase + 'new.json',
  hits: apiBase + 'hits.json'
}

const yargs = require('yargs') // eslint-disable-line no-unused-vars
  .scriptName('nvu')
  .usage('$0 <command> <args>')
  .command('latest [releaseLine]', 'List the latest versions of Node.js', () => {}, (argv) => {
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
  })
  .argv

// helper functions

/**
 * 
 * @param {String} message 
 * @param {String} symbol
 */
function logger(message, symbol) {
  switch(symbol) {
    case 'success':
      console.log(symbols.success, message)
      break;
    case 'info':
      console.log(symbols.info, message)
      break
    case 'warning':
      console.log(symbols.warning, message)
      break
    case 'error':
      console.error(symbols.error, message)
      break
  }
}

// command functions

/**
 * 
 * @param {Object} argv
 */
function latest (argv) {
  request(api.latest, function(error, response, body) {
    if (error) throw error

    try {
      const data = JSON.parse(body)
      
      for (var entry in data) {
        logger(entry, 'info')
      }
    } catch {
      console.log('oops')
    }
  })
}