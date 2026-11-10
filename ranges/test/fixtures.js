const { at } = require('@nodevu/fixtures');

// every version in index.json, like v22.19.0
const versionPattern = /^v\d+\.\d+\.\d+$/;

module.exports = { at, versionPattern };
