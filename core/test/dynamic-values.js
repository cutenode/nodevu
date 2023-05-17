const assert = require('node:assert')
const nodevu = require('../index')
const { describe, it, beforeEach } = require('test')

const beforeEachTemplate = require('../util/dev/beforeEachTemplate')

const staticNow = require('./data/static/now.json')
const now = JSON.parse(staticNow)

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
    assert.deepStrictEqual(staticData.v14.support.phases.current, 'end')
    assert.deepStrictEqual(staticData.v16.support.phases.current, 'maintenance')
    assert.deepStrictEqual(staticData.v17.support.phases.current, 'end')
    assert.deepStrictEqual(staticData.v18.support.phases.current, 'lts')
    assert.deepStrictEqual(staticData.v20.support.phases.current, 'start')
  })
})
