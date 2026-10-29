const assert = require('node:assert');
const { describe, it } = require('node:test');

const parseFilename = require('../index');

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
});
