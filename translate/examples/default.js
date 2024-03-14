const ranges = require('../../ranges') // would normally be "const ranges = require('@nodevu/ranges')" in your code
const translate = require('../index') // would normally be "const translate = require('@nodevu/translate')" in your code

async function getTranslatedData () {
  // translation for the 'current' Package Support term
  const translatedCurrent = await ranges('current')

  // translation for the 'lts_latest' Package Support term
  const translatedLtsLatest = await ranges(await translate('lts_latest'))

  // translation for the 'lts' Package Support term
  const translatedLts = await ranges(await translate('lts'))

  // translation for the 'supported' Package Support term
  const translatedSupported = await ranges(await translate('supported'))

  // translation for the 'all' Package Support term
  const translatedAll = await ranges(await translate('all'))

  // return the data in a single object
  return {
    current: translatedCurrent,
    lts_latest: translatedLtsLatest,
    lts: translatedLts,
    supported: translatedSupported,
    all: translatedAll
  }
}

getTranslatedData().then(console.log)
