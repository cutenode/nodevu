const assert = require('node:assert');
const ranges = require('../index');
const { describe, it } = require('test');

// this is a non-exhaustive list of sets of aliases.
// please feel free to add more.
describe('data should exist as it is defined when calling multiple aliases', async () => {
	// begin by testing some of the more risky logic in the data construction
	it('versions should have correct types on every property if an array when "lts/latest" and "lts/maintenance" are passed', async () => {
		const data = await ranges(['lts/latest', 'lts/maintenance']);

		// check lts/latest values
		assert.deepStrictEqual(Array.isArray(data['lts/latest'].versions), true);
		assert.deepStrictEqual(data['lts/latest'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/latest'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// check lts/maintenance values
		assert.deepStrictEqual(
			Array.isArray(data['lts/maintenance'].versions),
			true,
		);
		assert.deepStrictEqual(data['lts/maintenance'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/maintenance'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// check that lts/active does not exist
		assert.deepStrictEqual(data['lts/active'], undefined);
	});

	it('versions should have correct types on every property if an array when "lts/latest" and "lts/active" are passed', async () => {
		const data = await ranges(['lts/latest', 'lts/active']);

		// check lts/latest values
		assert.deepStrictEqual(Array.isArray(data['lts/latest'].versions), true);
		assert.deepStrictEqual(data['lts/latest'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/latest'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// check lts/active values
		assert.deepStrictEqual(Array.isArray(data['lts/active'].versions), true);
		assert.deepStrictEqual(data['lts/active'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/active'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// check that lts/maintenance does not exist
		assert.deepStrictEqual(data['lts/maintenance'], undefined);
	});

	it('versions should have correct types on every property if an array when "lts/maintenance" and "lts/active" are passed', async () => {
		const data = await ranges(['lts/maintenance', 'lts/active']);

		// check lts/maintenance values
		assert.deepStrictEqual(
			Array.isArray(data['lts/maintenance'].versions),
			true,
		);
		assert.deepStrictEqual(data['lts/maintenance'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/maintenance'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// check lts/active values
		assert.deepStrictEqual(Array.isArray(data['lts/active'].versions), true);
		assert.deepStrictEqual(data['lts/active'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/active'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// check that lts/maintenance does not exist
		assert.deepStrictEqual(data['lts/latest'], undefined);
	});

	it('versions should have correct types on every property if an array when "lts/maintenance", "lts/active", and "lts/latest" are passed', async () => {
		const data = await ranges(['lts/maintenance', 'lts/active', 'lts/latest']);

		// check lts/maintenance values
		assert.deepStrictEqual(
			Array.isArray(data['lts/maintenance'].versions),
			true,
		);
		assert.deepStrictEqual(data['lts/maintenance'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/maintenance'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// check lts/active values
		assert.deepStrictEqual(Array.isArray(data['lts/active'].versions), true);
		assert.deepStrictEqual(data['lts/active'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/active'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// check lts/latest values
		assert.deepStrictEqual(Array.isArray(data['lts/latest'].versions), true);
		assert.deepStrictEqual(data['lts/latest'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/latest'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);
	});

	// move on to testing some additional cases we probably don't want to break
	// specifically, we don't want to break these because they're the ones that
	// are translated by @nodevu/translate.

	// i am aware that we test the specific example below elsewhere. however,
	// we want to make sure that we're specifically testing the translations
	// as a set to ensure that it is direct and clear when they're breaking.
	it('should pass the "lts" translation ("lts/active" and "lts/maintenance")', async () => {
		const data = await ranges(['lts/active', 'lts/maintenance']);

		// check lts/active values
		assert.deepStrictEqual(Array.isArray(data['lts/active'].versions), true);
		assert.deepStrictEqual(data['lts/active'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/active'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// check lts/maintenance values
		assert.deepStrictEqual(
			Array.isArray(data['lts/maintenance'].versions),
			true,
		);
		assert.deepStrictEqual(data['lts/maintenance'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/maintenance'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// ensure nothing else exists
		assert.deepStrictEqual(data.all, undefined);
		assert.deepStrictEqual(data.current, undefined);
		assert.deepStrictEqual(data['lts/latest'], undefined);
		assert.deepStrictEqual(data.eol, undefined);
	});

	it('should pass the "supported" translation ("current", "lts/active", and "lts/maintenance")', async () => {
		const data = await ranges(['current', 'lts/active', 'lts/maintenance']);

		// check current values
		assert.deepStrictEqual(Array.isArray(data.current.versions), true);
		assert.deepStrictEqual(data.current.versions.length > 0, true);
		assert.deepStrictEqual(
			data.current.versions.every((version) => typeof version === 'string'),
			true,
		);

		// check lts/active values
		assert.deepStrictEqual(Array.isArray(data['lts/active'].versions), true);
		assert.deepStrictEqual(data['lts/active'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/active'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// check lts/latest values
		assert.deepStrictEqual(
			Array.isArray(data['lts/maintenance'].versions),
			true,
		);
		assert.deepStrictEqual(data['lts/maintenance'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/maintenance'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// ensure nothing else exists
		assert.deepStrictEqual(data.all, undefined);
		assert.deepStrictEqual(data['lts/latest'], undefined);
		assert.deepStrictEqual(data.eol, undefined);
	});

	it('should pass the "supported" translation ("current", "lts/active", and "lts/maintenance")', async () => {
		const data = await ranges(['current', 'lts/active', 'lts/maintenance']);

		// check current values
		assert.deepStrictEqual(Array.isArray(data.current.versions), true);
		assert.deepStrictEqual(data.current.versions.length > 0, true);
		assert.deepStrictEqual(
			data.current.versions.every((version) => typeof version === 'string'),
			true,
		);

		// check lts/active values
		assert.deepStrictEqual(Array.isArray(data['lts/active'].versions), true);
		assert.deepStrictEqual(data['lts/active'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/active'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// check lts/latest values
		assert.deepStrictEqual(
			Array.isArray(data['lts/maintenance'].versions),
			true,
		);
		assert.deepStrictEqual(data['lts/maintenance'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/maintenance'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// ensure nothing else exists
		assert.deepStrictEqual(data.all, undefined);
		assert.deepStrictEqual(data['lts/latest'], undefined);
		assert.deepStrictEqual(data.eol, undefined);
	});

	it('should pass the "all" translation ("current", "lts/active", "lts/maintenance", and "eol")', async () => {
		const data = await ranges([
			'current',
			'lts/active',
			'lts/maintenance',
			'eol',
		]);

		// check current values
		assert.deepStrictEqual(Array.isArray(data.current.versions), true);
		assert.deepStrictEqual(data.current.versions.length > 0, true);
		assert.deepStrictEqual(
			data.current.versions.every((version) => typeof version === 'string'),
			true,
		);

		// check lts/active values
		assert.deepStrictEqual(Array.isArray(data['lts/active'].versions), true);
		assert.deepStrictEqual(data['lts/active'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/active'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// check lts/latest values
		assert.deepStrictEqual(
			Array.isArray(data['lts/maintenance'].versions),
			true,
		);
		assert.deepStrictEqual(data['lts/maintenance'].versions.length > 0, true);
		assert.deepStrictEqual(
			data['lts/maintenance'].versions.every(
				(version) => typeof version === 'string',
			),
			true,
		);

		// ensure nothing else exists
		assert.deepStrictEqual(data.all, undefined);
		assert.deepStrictEqual(data['lts/latest'], undefined);
	});
});
