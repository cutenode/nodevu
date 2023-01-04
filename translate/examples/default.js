const ranges = require('../../ranges') // would normally be "const ranges = require('@nodevu/ranges')" in your code
const translate = require('../index') // would normally be "const translate = require('@nodevu/translate')" in your code

async function getTranslatedData () {
  // translation for the 'current' Package Support term
  const current = await ranges('current')
  
  // translation for the 'lts_latest' Package Support term
  const lts_latest = await ranges(await translate('lts_latest'))
  
  // translation for the 'lts' Package Support term
  const lts = await ranges(await translate('lts'))
  
  // translation for the 'supported' Package Support term
  const supported = await ranges(await translate('supported'))

  // translation for the 'all' Package Support term
  const all = await ranges(await translate('all'))

  // return the data in a single object
  return {
    current,
    lts_latest,
    lts,
    supported,
    all
  }
}

getTranslatedData().then(console.log)