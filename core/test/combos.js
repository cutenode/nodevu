const assert = require('node:assert')
const nodevu = require('../index')
const { describe, it, beforeEach } = require('test')

const beforeEachTemplate = require('../util/dev/beforeEachTemplate')

const staticNow = require('./data/static/now.json')
const now = JSON.parse(staticNow)

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
