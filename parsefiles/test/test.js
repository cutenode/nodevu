const assert = require('assert')
const { describe, it } = require('test')

const parseFiles = require('../index')
const input = require('./data/input.json')
const expected = require('./data/expected.json')


const mockverson = '420.420.420'

// this will cover most cases!
describe('check if controlled input matches controlled expected output', () => {
  it('should match expected output', () => {
    const result = input.map(file => parseFiles(file, '17.7.0'))
    assert.deepEqual(result, expected)
  })
})

// cover deprecated cases that we still might want information for
describe('check if sunos support is working as expected', () => {
  it('should return the correct sunos version string', () => {
    const id = 'sunos-x64'
    const result = parseFiles(id, mockverson)
    assert.deepEqual(result.architecture, 'x64')
    assert.deepEqual(result.files, [`node-v${mockverson}-sunos-x64.tar.gz`, `node-v${mockverson}-sunos-x64.tar.xz`])
    assert.deepEqual(result.id, id)
    assert.deepEqual(result.type, 'sunos')
  })
})

describe('check if the armv6l support is working as expected', () => {
  const id = 'linux-armv6l'
  const result = parseFiles(id, mockverson)
  assert.deepEqual(result.architecture, 'armv6l')
  assert.deepEqual(result.files, [`node-v${mockverson}-linux-armv6l.tar.gz`, `node-v${mockverson}-linux-armv6l.tar.xz`])
  assert.deepEqual(result.id, id)
  assert.deepEqual(result.type, 'linux')
})
