const { DateTime } = require('luxon');

// this function allows us to parse user-passed options.
//
// this is particularly useful for tests so we can reduce variables
// and ensure that our test suite is able to be consistent.
function parseOptions(options) {
	// set up our defaults
	const parsedOptions = {
		fetch: globalThis.fetch,
		now: DateTime.now(),
		urls: {
			index: 'https://nodejs.org/dist/index.json',
			schedule:
				'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json',
		},
	};

	// allow the end-user to replace our fetch implementation with another one they prefer.
	if (options?.fetch) {
		parsedOptions.fetch = options.fetch;
	}

	// allow the end-user to provide a custom DateTime. This is particularly useful for tests.
	if (options?.now) {
		parsedOptions.now = options.now;
	}

	if (options?.urls?.index) {
		parsedOptions.urls.index = options.urls.index;
	}

	if (options?.urls?.schedule) {
		parsedOptions.urls.schedule = options.urls.schedule;
	}

	return parsedOptions;
}

module.exports = parseOptions;