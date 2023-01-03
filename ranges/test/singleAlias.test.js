const assert = require('assert')
const ranges = require('../index')
const { describe, it } = require('test')

describe('data should exist as it is defined when calling a single alias', async () => {
  it('versions should have correct types on every property if an array with "all" is passed', async () => {
    const data = await ranges(['all'])
    assert.deepStrictEqual(Array.isArray(data.all.versions), true)
    assert.deepStrictEqual(data.all.versions.length > 0, true)
    assert.deepStrictEqual(data.all.versions.every(version => typeof version === 'string'), true)
  })

  it('versions should have correct types on every property if an array with "current" is passed', async () => {
    const data = await ranges(['current'])
    assert.deepStrictEqual(Array.isArray(data.current.versions), true)
    assert.deepStrictEqual(data.current.versions.length > 0, true)
    assert.deepStrictEqual(data.current.versions.every(version => typeof version === 'string'), true)
  })

  it('versions should have correct types on every property if an array with "lts/latest" is passed', async () => {
    const data = await ranges(['lts/latest'])
    assert.deepStrictEqual(Array.isArray(data['lts/latest'].versions), true)
    assert.deepStrictEqual(data['lts/latest'].versions.length > 0, true)
    assert.deepStrictEqual(data['lts/latest'].versions.every(version => typeof version === 'string'), true)

    // ensure that both lts/maintenance and lts/active are not present
    assert.deepStrictEqual(data['lts/maintenance'], undefined)
    assert.deepStrictEqual(data['lts/active'], undefined)
  })

  it('versions should have correct types on every property if an array with "lts/active" is passed', async () => {
    const data = await ranges(['lts/active'])
    assert.deepStrictEqual(Array.isArray(data['lts/active'].versions), true)
    assert.deepStrictEqual(data['lts/active'].versions.length > 0, true)
    assert.deepStrictEqual(data['lts/active'].versions.every(version => typeof version === 'string'), true)

    // ensure that both lts/latest and lts/maintenance are not present
    assert.deepStrictEqual(data['lts/latest'], undefined)
    assert.deepStrictEqual(data['lts/maintenance'], undefined)
  })

  it('versions should have correct types on every property if an array with "lts/maintenance" is passed', async () => {
    const data = await ranges(['lts/maintenance'])
    assert.deepStrictEqual(Array.isArray(data['lts/maintenance'].versions), true)
    assert.deepStrictEqual(data['lts/maintenance'].versions.length > 0, true)
    assert.deepStrictEqual(data['lts/maintenance'].versions.every(version => typeof version === 'string'), true)

    // ensure that both lts/latest and lts/active are not present
    assert.deepStrictEqual(data['lts/latest'], undefined)
    assert.deepStrictEqual(data['lts/active'], undefined)
  })

  it('versions should have correct types on every property if an array with "eol" is passed', async () => {
    const data = await ranges(['eol'])
    assert.deepStrictEqual(Array.isArray(data.eol.versions), true)
    assert.deepStrictEqual(data.eol.versions.length > 0, true)
    assert.deepStrictEqual(data.eol.versions.every(version => typeof version === 'string'), true)
  })
})
