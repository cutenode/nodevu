const assert = require('assert')
const ranges = require('../index')

describe('data should exist as it is defined', async () => {
  const data = await ranges()

  it('versions should have correct types on every property', () => {
    for (const key in data) {
      assert.strictEqual(Array.isArray(data[key].versions), true)
      assert.strictEqual(data[key].versions.length > 0, true)
      assert.strictEqual(data[key].versions.every(version => typeof version === 'string'), true)
    }
  })

  it('both newest and oldest on every property should be the correct type', async () => {
    for (const key in data) {
      assert.strictEqual(typeof data[key].newest, 'string')
      assert.strictEqual(typeof data[key].oldest, 'string')
    }
  })
})
