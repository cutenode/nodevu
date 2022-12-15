const assert = require('node:assert')
const nodevu = require('../index')
const { describe, it, beforeEach } = require('test')

const beforeEachTemplate = require('../util/dev/beforeEachTemplate')

function check (data) {
  // releases checks
  assert.deepStrictEqual(data.v17.releases['v17.0.0'].dependencies.npm, '8.1.0')
  assert.deepStrictEqual(data.v17.releases['v17.0.0'].dependencies.v8, '9.5.172.21')
  // support checks
  assert.deepStrictEqual(data.v14.support.codename, 'Fermium')
  assert.deepStrictEqual(data.v14.support.lts.newest, '14.19.0')
  assert.deepStrictEqual(data.v9.support.phases.current, 'end')
  assert.deepStrictEqual(data.v8.support.phases.current, 'end')
  // security checks
  assert.deepStrictEqual(data.v12.security.all.length, 14)
  assert.deepStrictEqual(data.v12.security.newest, '12.22.9')
  assert.deepStrictEqual(data.v12.security.oldest, '12.8.1')
}

const staticNow = require('./data/static/now.json')
const now = JSON.parse(staticNow)

describe('check to make sure that combining options works as expected', async () => {
  beforeEach(beforeEachTemplate)

  it('should still return valid data when the index is a different URL from the default while also using static now', async () => {
    const urls = {
      index: 'https://bnb.im/dist/index.json'
    }
    const staticData = await nodevu({ now, urls })

    check(staticData)
  })

  it('should still return valid data when the schedule is a different URL from the default while also using static now', async () => {
    const urls = {
      schedule: 'https://bnb.im/dist/schedule.json'
    }
    const staticData = await nodevu({ now, urls })

    check(staticData)
  })

  it('should still return valid data when the index and the schedule are a different URL from the default while also using static now', async () => {
    const urls = {
      index: 'https://bnb.im/dist/index.json',
      schedule: 'https://bnb.im/dist/schedule.json'
    }
    const staticData = await nodevu({ now, urls })

    check(staticData)
  })
})
