const assert = require('assert')
const ranges = require('../index')
const { describe, it } = require('test')

describe('failure states for arguments', async () => {
  it('should throw an error on a string with an unknown value', async () => {
    try {
      const data = await ranges('poopin')
    } catch (error) { 
      assert.deepStrictEqual(error.message, 'Unknown value passed as a filter. The passed value: \'poopin\'.')
    }
  })

  it('should throw an error on a string with an unknown value', async () => {
    try {
      const data = await ranges('poopin')
    } catch (error) { 
      assert.deepStrictEqual(error.message, 'Unknown value passed as a filter. The passed value: \'poopin\'.')
    }
  })

  it('should throw an error on a single unknown array entry', async () => {
    try {
      const data = await ranges(['poopin'])
    } catch (error) { 
      assert.deepStrictEqual(error.message, 'At least one of the values passed as a filter is unknown. The passed value(s): \'poopin\'')
    }
  })

  it('should throw an error on an unknown array entry where multiple entries exist and it is the first entry', async () => {
    try {
      const data = await ranges(['poopin', 'lts/active'])
    } catch (error) { 
      assert.deepStrictEqual(error.message, 'At least one of the values passed as a filter is unknown. The passed value(s): \'poopin\', \'lts/active\'')
    }
  })

  it('should throw an error on an unknown array entry where multiple entries exist and it is the first entry', async () => {
    try {
      const data = await ranges(['lts/active', 'poopin'])
    } catch (error) { 
      assert.deepStrictEqual(error.message, 'At least one of the values passed as a filter is unknown. The passed value(s): \'lts/active\', \'poopin\'')
    }
  })

  it('should throw an error on passing an Object', async () => {
    try {
      const data = await ranges({})
    } catch (error) { 
      assert.deepStrictEqual(error.message, 'Unknown value passed as a filter. The passed value: \'[object Object]\', with a type of \'object\'. Make sure you are passing a string (or an Array of strings) with valid value(s).')
    }
  })
})
