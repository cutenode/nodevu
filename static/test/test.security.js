const assert = require('node:assert')
const static = require('../index')
const { security } = require('../index')
const { describe, it } = require('test')

// always feel free to add more checks here - any addition will help ensure that we're even more solid.
//
// these tests are also generally copy/pasted between the test files - both in this file and in core. why?
// specifically because we want to be sure the data is consistent *and* because we want to be sure that
// the various ways of accessing the data produce consistent results. 

function check(data) {
    // security checks
    assert.deepStrictEqual(data.v12.all.length, 15)
    assert.deepStrictEqual(data.v12.newest, '12.22.11')
    assert.deepStrictEqual(data.v12.oldest, '12.8.1')
}

describe("test some known data in security.json export, being called from the default require", async () => {
    it('should return the correct data for all types', () => {
        check(static.security)
    })
})

describe("test some known data in security.json export, being called from a named require", async () => {
    it('should return the correct data for all types', () => {
        check(security)
    })
})
