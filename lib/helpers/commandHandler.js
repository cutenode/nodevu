const logger = require('./logger')
const output = require('./output')

/**
 * The goal of this handler is to standardize how output is managed across all comands, and enable those commands to have a consistent interface
 *
 * @typedef { 'success' | 'info' | 'warning' | 'error' | 'none' } Status
 * @typedef { { text: string, textPlain: string, json: {}, error: string, status: Status } Message }
 * @typedef { { json: boolean, ci: boolean, plain: boolean } AcceptableFlags }
 * @param { * } argv
 * @param { Message } message
 * @param { AcceptableFlags } acceptableFlags
 */
const handler = function (argv, message, acceptableFlags) {
  const staticMessages = { // messages that are static to commandHandler.js
    flagNotAccepted: 'A flag you passed with the command is not allowed with the command.'
  }

  try {
    if (argv.json === true && acceptableFlags.json === true) {
      return output(message.json, 'json', message.status)
    }

    if (argv.ci === true && acceptableFlags.ci === true) {
      return output({}, 'ci', message.status) // empty object since this doesn't actually output anything
    }

    if (argv.plain === true && acceptableFlags.plain === true) {
      return output(message.textPlain, 'human', message.status)
    }

    if ((argv.json === true && acceptableFlags.json === false) || (argv.ci === true && acceptableFlags.ci === false) || (argv.plain === true && acceptableFlags.plain === false)) {
      return output(staticMessages.flagNotAccepted, 'human', 'error')
    }

    return output(message.text, 'human', message.status)
  } catch (error) {
    return logger(message.error, 'error')
  }
}

module.exports = handler
