// @ts-check
const logger = require('./logger')

/**
 * custom types:
 * @typedef { 'json' | 'ci' | 'human' } Output
 * @typedef { string | {} } Input
 * @typedef { 'success' | 'info' | 'warning' | 'error' } Status
 *
 * Expected inputs:
 * @param { Input } input
 * @param { Output } outputType
 * @param { Status } status
 */
const output = function (input, outputType, status) {
  let exitCode

  if (status === 'error') {
    exitCode = 1
  } else {
    exitCode = 0
  }

  switch (outputType) {
    case 'json':
      console.log(input) // input should just be a JSON object
      process.exit(exitCode)
    case 'ci':
      process.exit(exitCode)
    case 'human':
      logger(input, status)
      process.exit(exitCode)
  }
}

module.exports = output
