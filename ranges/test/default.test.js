const assert = require('assert')
const ranges = require('../index')
const { describe, it } = require('test')

describe('data should exist as it is defined', async () => {
  it('versions should have correct types on every property', async () => {
    const data = await ranges()
    for (const key in data) {
      assert.deepStrictEqual(Array.isArray(data[key].versions), true)
      assert.deepStrictEqual(data[key].versions.length > 0, true)
      assert.deepStrictEqual(data[key].versions.every(version => typeof version === 'string'), true)
    }
  })

  it('both newest and oldest on every property should be the correct type', async () => {
    const data = await ranges()
    for (const key in data) {
      assert.deepStrictEqual(typeof data[key].newest, 'string')
      assert.deepStrictEqual(typeof data[key].oldest, 'string')
    }
  })
})
