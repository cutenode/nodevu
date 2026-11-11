// the docs examples run with this loaded first, so they read the snapshot
// data instead of fetching nodejs.org, at the time the snapshot was taken
const { at } = require('@nodevu/fixtures');
const now = require('@nodevu/fixtures/data/now.json');

// core reads the time through luxon, which calls Date.now()
Date.now = () => Date.parse(now);

globalThis.fetch = at(now).fetch;
