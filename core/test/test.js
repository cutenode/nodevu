const assert = require('assert')
const nodevu = require('../index')
const { MockAgent, setGlobalDispatcher, fetch } = require('undici')
const index = require('./data/index.json')
const schedule = require('./data/schedule.json')

// this mock agent stuff isn't actually working for... some unkown reason
const mock = new MockAgent()
setGlobalDispatcher(mock)

const nodejsMock = mock.get('http://nodejs.org')
nodejsMock.intercept({ path: '/dist/index.json', method: 'GET' }).reply(200, index)

const githubMock = mock.get('https://raw.githubusercontent.com')
githubMock.intercept({ path: '/nodejs/Release/master/schedule.json', method: 'GET' }).reply(200, schedule)

describe('attempt to fetch data', async () => {
  it('should have some correct values for Node.js dependencies', async () => {
    const data = await nodevu({ fetch: fetch })
    assert.deepStrictEqual(data.v17.releases['v17.0.0'].dependencies.npm, '8.1.0')
    assert.deepStrictEqual(data.v17.releases['v17.0.0'].dependencies.v8, '9.5.172.21')
    assert.deepStrictEqual(data.v17.releases['v17.0.0'].dependencies.uv, '1.42.0')
    assert.deepStrictEqual(data.v17.releases['v17.0.0'].dependencies.zlib, '1.2.11')
    assert.deepStrictEqual(data.v17.releases['v17.0.0'].dependencies.openssl, '3.0.0+quic')
  })

  it('should have some correct static values for support in a release line', async () => {
    const data = await nodevu({ fetch: fetch })
    assert.deepStrictEqual(data.v14.support.codename, 'Fermium')
    assert.deepStrictEqual(data.v14.support.lts.newest, '14.19.0')
    assert.deepStrictEqual(data.v14.support.lts.oldest, '14.15.0')
    assert.deepStrictEqual(data.v14.support.phases.dates.start, '2020-04-21')
    assert.deepStrictEqual(data.v14.support.phases.dates.lts, '2020-10-27')
    assert.deepStrictEqual(data.v14.support.phases.dates.maintenance, '2021-10-19')
    assert.deepStrictEqual(data.v14.support.phases.dates.end, '2023-04-30')
  })

  it('should have some correct dynamic values for support in a release line', async () => {
    const data = await nodevu({ fetch: fetch })
    assert.deepStrictEqual(data.v8.support.phases.current, 'end')
    assert.deepStrictEqual(data.v14.support.phases.current, 'maintenance')
    assert.deepStrictEqual(data.v16.support.phases.current, 'lts')
    assert.deepStrictEqual(data.v17.support.phases.current, 'start')
  })
})
