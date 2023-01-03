const assert = require('node:assert')
const translate = require('../index')
const { describe, it } = require('test')

describe('test that translating current works as expected', async () => {
  it('should return "current" when passed "current"', async () => {
    const result = await translate('current')
    assert.deepStrictEqual(result, ['current'])
  })
})
