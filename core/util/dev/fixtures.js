const index = require('../../test/data/static/index.json');
const schedule = require('../../test/data/static/schedule.json');

// returns options for @nodevu/core (and the packages built on it) that serve
// `data` (core's index.json and schedule.json snapshots by default) instead of
// fetching them, only including releases that were out by `now`, like the
// real index.json. any other URL throws, so tests never touch the network.
function at(now, data = { index, schedule }) {
	return {
		now,
		fetch: async (url) => {
			if (url.endsWith('/schedule.json')) {
				return Response.json(data.schedule);
			}

			if (url.endsWith('/index.json')) {
				return Response.json(data.index.filter((entry) => entry.date <= now));
			}

			throw new Error(`No fixture data for ${url}`);
		},
	};
}

module.exports = { at };
