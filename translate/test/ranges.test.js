const assert = require('node:assert')
const translate = require('../index')
const ranges = require('@nodevu/ranges')
const { describe, it } = require('test')

describe('test that each alias works with @nodevu/ranges', async () => {
  it('should return the same result when both the translated and untranslated "current" are passed to @nodevu/ranges', async () => {
    const untranslated = await ranges('current')
    const translated = await ranges(await translate('current'))

    assert.deepStrictEqual(untranslated, translated)
  })

  it('should return the same result when "lts/latest" and the translated "lts_latest" are passed to @nodevu/ranges', async () => {
    const untranslated = await ranges('lts/latest')
    const translated = await ranges(await translate('lts_latest'))

    assert.deepStrictEqual(untranslated, translated)
  })

  it('should return the same result when "lts/active" and "lts/maintenance" and the translated "lts" are passed to @nodevu/ranges', async () => {
    const untranslated = await ranges(['lts/active', 'lts/maintenance'])
    const translated = await ranges(await translate('lts'))

    assert.deepStrictEqual(untranslated, translated)
  })

  it('should return the same result when "current", "lts/active", and "lts/maintenance" and the translated "supported" are passed to @nodevu/ranges', async () => {
    const untranslated = await ranges(['current', 'lts/active', 'lts/maintenance'])
    const translated = await ranges(await translate('supported'))

    assert.deepStrictEqual(untranslated, translated)
  })

  it('should return the same result when "current", "lts/active", "lts/maintenance", and "eol" and the translated "all" are passed to @nodevu/ranges', async () => {
    const untranslated = await ranges(['current', 'lts/active', 'lts/maintenance', 'eol'])
    const translated = await ranges(await translate('all'))

    assert.deepStrictEqual(untranslated, translated)
  })
})
