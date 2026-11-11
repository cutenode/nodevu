const assert = require('node:assert');
const ranges = require('../index');
const { at } = require('./fixtures');
const { describe, it } = require('node:test');

describe('failure states for arguments', async () => {
	it('should throw an error on a string with an unknown value', async () => {
		await assert.rejects(
			// @ts-expect-error: an unknown filter, on purpose
			ranges('poopin', at()),
			{
				message:
					"Unknown value passed as a filter. The passed value: 'poopin'.",
			},
		);
	});

	it('should throw an error on a single unknown array entry', async () => {
		await assert.rejects(
			// @ts-expect-error: an unknown filter, on purpose
			ranges(['poopin'], at()),
			{
				message:
					"At least one of the values passed as a filter is unknown. The passed value(s): 'poopin'",
			},
		);
	});

	it('should throw an error on an unknown array entry where multiple entries exist and it is the first entry', async () => {
		await assert.rejects(
			// @ts-expect-error: an unknown filter, on purpose
			ranges(['poopin', 'lts/active'], at()),
			{
				message:
					"At least one of the values passed as a filter is unknown. The passed value(s): 'poopin', 'lts/active'",
			},
		);
	});

	it('should throw an error on an unknown array entry where multiple entries exist and it is the last entry', async () => {
		await assert.rejects(
			// @ts-expect-error: an unknown filter, on purpose
			ranges(['lts/active', 'poopin'], at()),
			{
				message:
					"At least one of the values passed as a filter is unknown. The passed value(s): 'lts/active', 'poopin'",
			},
		);
	});

	it('should throw an error on passing an Object', async () => {
		await assert.rejects(
			// @ts-expect-error: an unknown filter, on purpose
			ranges({}, at()),
			{
				message:
					"Unknown value passed as a filter. The passed value: '[object Object]', with a type of 'object'. Make sure you are passing a string (or an Array of strings) with valid value(s).",
			},
		);
	});
});
