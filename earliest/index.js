const nodevu = require('@nodevu/core')

async function earliest (name, type) {
  const data = await nodevu()

  if (type === 'lts') {
    return data[name].support.lts.oldest
  }

  if (type === 'security') {
    return data[name].security.oldest
  }
}

async function lts (name) {
  return await earliest(name, 'lts')
}

async function security (name) {
  return await earliest(name, 'security')
}

module.exports.earliest = earliest
module.exports.lts = lts
module.exports.security = security
