const assert = require('assert')
const { earliest, lts, security } = require('../index')

describe('check v10', async function () {
  describe('running earliest', async function () {
    it('should return the correct security version for v10', async function () {
      const data = await earliest('v10', 'security')
      assert.equal(data, '10.14.0')
    })

    it('should return the correct lts version for v10', async function () {
      const data = await earliest('v10', 'lts')
      assert.equal(data, '10.13.0')
    })
  })

  describe('running security', async function () {
    it('should return the correct security version for v10', async function () {
      const data = await security('v10')
      assert.equal(data, '10.14.0')
    })
  })

  describe('running lts', async function () {
    it('should return the correct lts version for v10', async function () {
      const data = await lts('v10')
      assert.equal(data, '10.13.0')
    })
  })
})
