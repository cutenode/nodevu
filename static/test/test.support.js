const assert = require('node:assert')
const staticData = require('../index')
const { support } = require('../index')
const { describe, it } = require('test')

// always feel free to add more checks here - any addition will help ensure that we're even more solid.
//
// these tests are also generally copy/pasted between the test files - both in this file and in core. why?
// specifically because we want to be sure the data is consistent *and* because we want to be sure that
// the various ways of accessing the data produce consistent results. 

function check(data) {
    // support checks
    assert.deepStrictEqual(data.v14.codename, 'Fermium')
    assert.deepStrictEqual(data.v12.lts.newest, '12.22.12')
    assert.deepStrictEqual(data.v9.phases.current, 'end')
    assert.deepStrictEqual(data.v8.phases.current, 'end')
}

describe("test known data in support.json export, being called from the default require", async () => {
    it('should return the correct data for all types', () => {
        check(staticData.support)
    })
})

describe("test known data in support.json export, being called from a named require", async () => {
    it('should return the correct data for all types', () => {
        check(support)
    })
})
