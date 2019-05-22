const symbols = require('log-symbols')

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

module.exports = logger