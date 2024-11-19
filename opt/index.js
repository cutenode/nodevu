const { DateTime } = require('luxon');

// this function allows us to parse user-passed options.
//
// this is particularly useful for tests so we can reduce variables
// and ensure that our test suite is able to be consistent.
function opt(inputOptions) {
	// set up our defaults
	const result = {
		fetch: globalThis.fetch,
		now: DateTime.now(),
		urls: {
			index: 'https://nodejs.org/dist/index.json',
			schedule:
				'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json',
		},
	};

	if (typeof inputOptions === 'undefined') {
		return result;
	}

	// allow the end-user to replace our fetch implementation with another one they prefer.
	if (inputOptions?.fetch) {
		result.fetch = inputOptions.fetch;
	}

	// allow the end-user to provide a custom DateTime. This is particularly useful for tests.
	if (inputOptions?.now) {
		result.now = inputOptions.now;
	}

	if (inputOptions?.urls?.index) {
		result.urls.index = inputOptions.urls.index;
	}

	if (inputOptions?.urls?.schedule) {
		result.urls.schedule = inputOptions.urls.schedule;
	}

	return result;
}

module.exports = opt;
