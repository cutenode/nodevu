const assert = require('node:assert');
const { describe, it } = require('node:test');
const fc = require('fast-check');

const parseFilename = require('../index');
const releases = require('../../core/test/data/static/index.json');

describe('parseFilename', () => {
	it('should only list the win-x86 directory for win-x86-exe', () => {
		// Arrange
		const id = 'win-x86-exe';

		// Act
		const result = parseFilename(id, '4.0.0');

		// Assert
		assert.deepStrictEqual(result.files, [
			'win-x86/node.exe',
			'win-x86/node.lib',
			'win-x86/node_pdb.7z',
			'win-x86/node_pdb.zip',
		]);
	});

	it('should only list the win-x64 directory for win-x64-exe', () => {
		// Arrange
		const id = 'win-x64-exe';

		// Act
		const result = parseFilename(id, '4.0.0');

		// Assert
		assert.deepStrictEqual(result.files, [
			'win-x64/node.exe',
			'win-x64/node.lib',
			'win-x64/node_pdb.7z',
			'win-x64/node_pdb.zip',
		]);
	});

	it('should name the darwin-x86 tarball for osx-x86-tar', () => {
		// Arrange
		const id = 'osx-x86-tar';

		// Act
		const result = parseFilename(id, '4.0.0');

		// Assert
		assert.deepStrictEqual(result.files, ['node-v4.0.0-darwin-x86.tar.gz']);
	});

	it('should always set a type for a real id', async () => {
		await fc.assert(
			fc.property(realIdArbitrary(), versionArbitrary(), (id, version) => {
				// Arrange (by the arbitraries)

				// Act
				const result = parseFilename(id, version);

				// Assert
				assert.notStrictEqual(result.type, undefined);
			}),
		);
	});

	it('should always keep the id it was given', async () => {
		await fc.assert(
			fc.property(realIdArbitrary(), versionArbitrary(), (id, version) => {
				// Arrange (by the arbitraries)

				// Act
				const result = parseFilename(id, version);

				// Assert
				assert.strictEqual(result.id, id);
			}),
		);
	});

	it('should never return the bare id as a file name', async () => {
		await fc.assert(
			fc.property(realIdArbitrary(), versionArbitrary(), (id, version) => {
				// Arrange (by the arbitraries)

				// Act
				const result = parseFilename(id, version);

				// Assert
				assert.ok(!result.files.includes(id), result.files.join(', '));
			}),
		);
	});

	it('should always name files after the version or a win-* directory', async () => {
		await fc.assert(
			fc.property(realIdArbitrary(), versionArbitrary(), (id, version) => {
				// Arrange
				const isNamed = (/** @type {string} */ name) =>
					name.includes(`v${version}`) || /^win-[^/]+\/[^/]+$/.test(name);

				// Act
				const result = parseFilename(id, version);

				// Assert
				assert.ok(result.files.every(isNamed), result.files.join(', '));
			}),
		);
	});

	it('should always set an architecture for a real id other than src and headers', async () => {
		await fc.assert(
			fc.property(
				realIdArbitrary(['src', 'headers']),
				versionArbitrary(),
				(id, version) => {
					// Arrange (by the arbitraries)

					// Act
					const result = parseFilename(id, version);

					// Assert
					assert.notStrictEqual(result.architecture, undefined);
				},
			),
		);
	});
});

// Helpers

/**
 * Every id in the `files` of a release in the release index snapshot.
 *
 * @param {string[]} [excluded] Ids to leave out.
 */
function realIdArbitrary(excluded = []) {
	const ids = new Set(releases.flatMap((release) => release.files));

	return fc.constantFrom(...[...ids].filter((id) => !excluded.includes(id)));
}

/** A version without its `v`, such as `'17.7.0'`. */
function versionArbitrary() {
	return fc.tuple(fc.nat(), fc.nat(), fc.nat()).map((parts) => parts.join('.'));
}
