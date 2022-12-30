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

describe('check some values we know should exist', async () => {
  it('should include some known, static values in "all"', async () => {
    const data = await ranges()
    assert.deepStrictEqual(data.all.versions.includes('v19.0.0'), true) // a semver major we know exists
    assert.deepStrictEqual(data.all.versions.includes('v14.21.0'), true) // an LTS release we know happened
    assert.deepStrictEqual(data.all.versions.includes('v0.1.14'), true) // oldest included data in the array - this is the correct oldest data since it's technically the first entry on nodejs.org/dist/index.json
  })

  it('should include some known, static values in "eol"', async () => {
    const data = await ranges()
    assert.deepStrictEqual(data.all.versions.includes('v14.21.0'), true) // an LTS release we know happened
    assert.deepStrictEqual(data.eol.versions.includes('v0.8.0'), true) // oldest included data in the array - this should be fixed since it's clearly not the oldest in the dataset.
  })
})

describe('check that "v"s are where they should (and are not where they should not be)', async () => {
  it('should include the letter v before the strings that should have it', async () => {
    const data = await ranges()
    
    // loop over all versions arrays in all sets (all,
    // current, lts/latest, lts/active, lts/maintenance, 
    // and eol) and check that they all start with a v
    for(const entry in data) {
      for (const version in data[entry].versions) {
        assert.deepStrictEqual(data[entry].versions[version].startsWith('v'), true)
      }
      
      // all newest and oldest entries should start with v
      assert.deepStrictEqual(data[entry].newest.startsWith('v'), true)
      assert.deepStrictEqual(data[entry].oldest.startsWith('v'), true)
    }

    assert.deepStrictEqual(data['all'].newestLts.startsWith('v'), true)
    assert.deepStrictEqual(data['all'].newestSecurity.startsWith('v'), true)
  })

  // this probably needs to be fixed. It's a bug in core and it trickles down to ranges.
  it('is missing the letter v where it should not be... for now', async () => {
    const data = await ranges()
    assert.deepStrictEqual(data['current'].oldestSecurity.startsWith('v'), false)
    assert.deepStrictEqual(data['current'].newestSecurity.startsWith('v'), false)
    
    assert.deepStrictEqual(data['lts/latest'].oldestLts.startsWith('v'), false)
    assert.deepStrictEqual(data['lts/latest'].oldestSecurity.startsWith('v'), false)
    assert.deepStrictEqual(data['lts/latest'].newestLts.startsWith('v'), false)
    assert.deepStrictEqual(data['lts/latest'].newestSecurity.startsWith('v'), false)

    assert.deepStrictEqual(data['lts/active'].oldestLts.startsWith('v'), false)
    assert.deepStrictEqual(data['lts/active'].oldestSecurity.startsWith('v'), false)
    assert.deepStrictEqual(data['lts/active'].newestLts.startsWith('v'), false)
    assert.deepStrictEqual(data['lts/active'].newestSecurity.startsWith('v'), false)

    assert.deepStrictEqual(data['lts/maintenance'].oldestLts.startsWith('v'), false)
    assert.deepStrictEqual(data['lts/maintenance'].oldestSecurity.startsWith('v'), false)
    assert.deepStrictEqual(data['lts/maintenance'].newestLts.startsWith('v'), false)
    assert.deepStrictEqual(data['lts/maintenance'].newestSecurity.startsWith('v'), false)
    
  })
})
