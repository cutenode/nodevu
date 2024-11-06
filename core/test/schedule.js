const { deepStrictEqual } = require('node:assert');
const { describe, it } = require('test');
const { fetch: undiciFetch } = require('undici')
const { DateTime } = require('luxon');
const nodevu = require('../index');
const schedule = require('../util/prod/schedule')
const optionsParser = require('../util/prod/optionsParser')

// checks that verify the result of data returned
function check (data) {
	for (const [line, metadata] of Object.entries(data)) {
		for (const [metadataKey, metadataValue] of Object.entries(metadata)) {
			deepStrictEqual(typeof metadataKey, 'string')
			deepStrictEqual(typeof metadataValue, 'string')
		}
	}
}

// set up options object that would normally be passed to the module
const options = {
	fetch: globalThis.fetch,
	urls: {
		schedule: 'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json'
	}
}

describe('under normal condiditons, schedule should work', async () => {
	it('should work with default options', async () => {
		const data = await schedule(options)
		check(data)
	})

	it('should work with Undici fetch', async () => {
		options.fetch = undiciFetch
		const data = await schedule(options)
		check(data)
	})
})

describe('schedule should work with optionsParser', async () => {
	it('should work with the default output of optionsParser', async () => {
		const parsedOptions = optionsParser({})
		const data = await schedule(parsedOptions)
	})

	it('should work with a different fetch pased to optionsParser', async () => {
		const parsedOptions = optionsParser({
			fetch: undiciFetch
		})
		const data = await schedule(parsedOptions)
	})
})