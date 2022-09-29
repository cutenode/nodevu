const assert = require('node:assert')
const nodevu = require('../index')
const { describe, it, beforeEach } = require('test')

const beforeEachTemplate = require('../util/dev/beforeEachTemplate')

// these are tests that run with static data but do not need to be frozen in time.
describe('check that we get the values we expect from values that should not ever change', async () => {
  beforeEach(beforeEachTemplate)

  it('should have some correct values for Node.js dependencies', async () => {
    const staticData = await nodevu()
    assert.deepStrictEqual(staticData.v17.releases['v17.0.0'].dependencies.npm, '8.1.0')
    assert.deepStrictEqual(staticData.v17.releases['v17.0.0'].dependencies.v8, '9.5.172.21')
    assert.deepStrictEqual(staticData.v17.releases['v17.0.0'].dependencies.uv, '1.42.0')
    assert.deepStrictEqual(staticData.v17.releases['v17.0.0'].dependencies.zlib, '1.2.11')
    assert.deepStrictEqual(staticData.v17.releases['v17.0.0'].dependencies.openssl, '3.0.0+quic')
  })

  it('should have some correct static values for support in a release line', async () => {
    const staticData = await nodevu()
    assert.deepStrictEqual(staticData.v14.support.codename, 'Fermium')
    assert.deepStrictEqual(staticData.v14.support.lts.newest, '14.19.0')
    assert.deepStrictEqual(staticData.v14.support.lts.oldest, '14.15.0')
    assert.deepStrictEqual(staticData.v14.support.phases.dates.start, '2020-04-21')
    assert.deepStrictEqual(staticData.v14.support.phases.dates.lts, '2020-10-27')
    assert.deepStrictEqual(staticData.v14.support.phases.dates.maintenance, '2021-10-19')
    assert.deepStrictEqual(staticData.v14.support.phases.dates.end, '2023-04-30')
  })
})