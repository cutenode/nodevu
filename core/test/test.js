const assert = require('node:assert')
const nodevu = require('../index')
const { describe, it, beforeEach } = require('test')

const beforeEachTemplate = require('../util/dev/beforeEachTemplate')

const staticNow = require('./data/static/now.json')
const now = JSON.parse(staticNow)

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

// this is a set of tests that only test against static data effectively frozen at a point in time.
// these tests should *probably* be updated sometimes. see the npm scripts for update scripts.
//
// of particular note about them, they use the `now` option in core to allow us to freeze the
// time that we're doing relative checks against.
//
// only tests that *require* the `now` option shoulod be in this set of tests.
describe('statically check that we get dynamic values correctly', async () => {
  beforeEach(beforeEachTemplate)

  it('should have some correct dynamic values for support in multiple release lines', async () => {
    const staticData = await nodevu({ now })
    assert.deepStrictEqual(staticData.v8.support.phases.current, 'end')
    assert.deepStrictEqual(staticData.v14.support.phases.current, 'maintenance')
    assert.deepStrictEqual(staticData.v16.support.phases.current, 'lts')
    assert.deepStrictEqual(staticData.v17.support.phases.current, 'start')
  })
})

describe('check to make sure that changing sources works as expected', async () => {
  beforeEach(beforeEachTemplate)

  // failing
  it('should still return valid data when the index is a different URL from the default', async () => {
    const urls = {
      index: 'https://bnb.im/dist/index.json'
    }
    const staticData = await nodevu({ urls })
    assert.deepStrictEqual(staticData.v17.releases['v17.0.0'].dependencies.npm, '8.1.0')
    assert.deepStrictEqual(staticData.v14.support.codename, 'Fermium')
    assert.deepStrictEqual(staticData.v8.support.phases.current, 'end')
  })

  // failing
  it('should still return valid data when the schedule is a different URL from the default', async () => {
    const urls = {
      schedule: 'https://bnb.im/dist/schedule.json'
    }
    const staticData = await nodevu({ urls })
    assert.deepStrictEqual(staticData.v17.releases['v17.0.0'].dependencies.v8, '9.5.172.21')
    assert.deepStrictEqual(staticData.v14.support.lts.newest, '14.19.0')
    assert.deepStrictEqual(staticData.v9.support.phases.current, 'end')
  })
})

describe('check to make sure that combining options works as expected', async () => {
  beforeEach(beforeEachTemplate)

  it('should still return valid data when the index is a different URL from the default while also using static now', async () => {
    const urls = {
      index: 'https://bnb.im/dist/index.json'
    }
    const staticData = await nodevu({ now, urls })
    assert.deepStrictEqual(staticData.v17.releases['v17.0.0'].dependencies.npm, '8.1.0')
    assert.deepStrictEqual(staticData.v14.support.codename, 'Fermium')
    assert.deepStrictEqual(staticData.v8.support.phases.current, 'end')
  })

  it('should still return valid data when the schedule is a different URL from the default while also using static now', async () => {
    const urls = {
      schedule: 'https://bnb.im/dist/schedule.json'
    }
    const staticData = await nodevu({ now, urls })
    assert.deepStrictEqual(staticData.v17.releases['v17.0.0'].dependencies.v8, '9.5.172.21')
    assert.deepStrictEqual(staticData.v14.support.lts.newest, '14.19.0')
    assert.deepStrictEqual(staticData.v9.support.phases.current, 'end')
  })

  it('should still return valid data when the index and the schedule are a different URL from the default while also using static now', async () => {
    const urls = {
      index: 'https://bnb.im/dist/index.json',
      schedule: 'https://bnb.im/dist/schedule.json'
    }
    const staticData = await nodevu({ now, urls })
    assert.deepStrictEqual(staticData.v17.releases['v17.0.0'].dependencies.v8, '9.5.172.21')
    assert.deepStrictEqual(staticData.v14.support.lts.newest, '14.19.0')
    assert.deepStrictEqual(staticData.v9.support.phases.current, 'end')
  })
})
