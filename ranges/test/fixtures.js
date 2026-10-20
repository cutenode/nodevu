const index = require('../../core/test/data/static/index.json');
const schedule = require('../../core/test/data/static/schedule.json');

// the default date for tests. on 2025-09-01, v24 is Current, v22 is Active
// LTS, v20 is Maintenance LTS, and v23 has reached End of Life, so every
// range has versions. every one of those lines also has a security release
// by then, so no security field is empty either.
const now = '2025-09-01';

// returns options for `ranges` that serve `data` (core's index.json and
// schedule.json snapshots by default) instead of fetching them, only including
// releases that would be out by `now`, like the real index.json. any other URL
// throws, so tests never touch the network.
function at(date = now, data = { index, schedule }) {
	return {
		now: date,
		fetch: async (url) => {
			if (url.endsWith('/schedule.json')) {
				return Response.json(data.schedule);
			}

			if (url.endsWith('/index.json')) {
				return Response.json(data.index.filter((entry) => entry.date <= date));
			}

			throw new Error(`No fixture data for ${url}`);
		},
	};
}

module.exports = { at };
