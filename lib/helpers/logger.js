const symbols = require('log-symbols')

/**
 * @typedef { 'success' | 'info' | 'warning' | 'error' } Status
 * @param { String } message 
 * @param { Status } status
 */
function logger(message, status) {
  switch(status) {
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

module.exports = logger