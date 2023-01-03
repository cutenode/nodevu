const assert = require('node:assert')
const translate = require('../index')
const ranges = require('@nodevu/ranges')
const { describe, it } = require('test')

describe('test that current works with @nodevu/ranges', async () => {
  it('should return the same result when both the translated and untranslated "current" are passed to @nodevu/ranges', async () => {
      const result = await ranges('current')
      assert.deepStrictEqual(result, ['current'])
  })
})