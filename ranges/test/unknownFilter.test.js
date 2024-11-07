const assert = require('node:assert');
const ranges = require('../index');
const { describe, it } = require('node:test');

describe('failure states for arguments', async () => {
	it('should throw an error on a string with an unknown value', async () => {
		try {
			const data = await ranges('poopin');
			if (data) throw new Error('Should not have gotten here');
		} catch (error) {
			assert.deepStrictEqual(
				error.message,
				"Unknown value passed as a filter. The passed value: 'poopin'.",
			);
		}
	});

	it('should throw an error on a string with an unknown value', async () => {
		try {
			const data = await ranges('poopin');
			if (data) throw new Error('Should not have gotten here');
		} catch (error) {
			assert.deepStrictEqual(
				error.message,
				"Unknown value passed as a filter. The passed value: 'poopin'.",
			);
		}
	});

	it('should throw an error on a single unknown array entry', async () => {
		try {
			const data = await ranges(['poopin']);
			if (data) throw new Error('Should not have gotten here');
		} catch (error) {
			assert.deepStrictEqual(
				error.message,
				"At least one of the values passed as a filter is unknown. The passed value(s): 'poopin'",
			);
		}
	});

	it('should throw an error on an unknown array entry where multiple entries exist and it is the first entry', async () => {
		try {
			const data = await ranges(['poopin', 'lts/active']);
			if (data) throw new Error('Should not have gotten here');
		} catch (error) {
			assert.deepStrictEqual(
				error.message,
				"At least one of the values passed as a filter is unknown. The passed value(s): 'poopin', 'lts/active'",
			);
		}
	});

	it('should throw an error on an unknown array entry where multiple entries exist and it is the first entry', async () => {
		try {
			const data = await ranges(['lts/active', 'poopin']);
			if (data) throw new Error('Should not have gotten here');
		} catch (error) {
			assert.deepStrictEqual(
				error.message,
				"At least one of the values passed as a filter is unknown. The passed value(s): 'lts/active', 'poopin'",
			);
		}
	});

	it('should throw an error on passing an Object', async () => {
		try {
			const data = await ranges({});
			if (data) throw new Error('Should not have gotten here');
		} catch (error) {
			assert.deepStrictEqual(
				error.message,
				"Unknown value passed as a filter. The passed value: '[object Object]', with a type of 'object'. Make sure you are passing a string (or an Array of strings) with valid value(s).",
			);
		}
	});
});
