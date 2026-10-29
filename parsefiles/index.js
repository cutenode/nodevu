/**
 * @typedef {object} ParsedFile
 * @property {string} id The identifier passed in, such as `'linux-x64'`.
 * @property {string[]} files The file names that should exist for the
 *   identifier.
 * @property {'aix' | 'headers' | 'linux' | 'macos' | 'source' | 'sunos' | 'windows'} [type]
 *   The platform, or what kind of files these are.
 * @property {'x86' | 'x64' | 'arm64' | 'armv7l' | 'armv6l' | 'power' | 'z'} [architecture]
 */

/**
 * Parses an identifier from the `files` of a release in the Node.js release
 * index into the file names it stands for, its platform, and its architecture.
 *
 * @param {string} file An identifier, such as `'win-x64-msi'`.
 * @param {string} version The release's version, without its `v`.
 * @returns {ParsedFile}
 */
function parseFilename(file, version) {
	/** @type {ParsedFile} */
	const info = {
		id: file,
		files: [file],
	};

	// to whoever reads this in the future: I'm sorry
	//
	// this code is basically a bunch of if statements that parse certain
	// parts of the `files` property on each release in
	// nodejs.org/dist/index.json and then builds out an object from that
	// so we can have more useful information about each release. It's a bit
	// messy, but it _seemingly_ works, at least at time of writing.
	//
	// Over time, there's historically been additions, so this will likely
	// drift apart from the reality of what's in there. Feel free to either
	// ping me or submit a PR to update it when that happens.

	if (info.files[0].includes('-pkg')) {
		// macOS filenames.
		info.files[0] = `node-v${version}.pkg`;
	} else if (info.files[0].includes('osx-')) {
		// macOS filenames, but with architectures. Different than the above.
		info.files[0] = `node-v${version}-${info.files[0]
			.replace('osx-', 'darwin-')
			.replace('-tar', '.tar.gz')}`;
	} else if (info.files[0].includes('-7z')) {
		// windows filenames
		info.files[0] = `node-v${version}-${info.files[0].replace('-7z', '.7z')}`;
	} else if (info.files[0].includes('-zip')) {
		info.files[0] = `node-v${version}-${info.files[0].replace('-zip', '.zip')}`;
	} else if (info.files[0].includes('-msi')) {
		info.files[0] = `node-v${version}-${info.files[0]
			.replace('-msi', '.msi')
			.replace('win-', '')}`;
	} else if (info.files[0].includes('-exe')) {
		// windows executables, in a directory named after the architecture
		const directory = info.files[0].replace('-exe', '');
		info.files = ['node.exe', 'node.lib', 'node_pdb.7z', 'node_pdb.zip'].map(
			(name) => `${directory}/${name}`,
		);
	} else if (info.files[0] === 'src') {
		// source filenames.
		info.files[0] = `node-v${version}.tar.gz`;
		info.files.push(`node-v${version}.tar.xz`);
	} else if (
		info.files[0].includes('linux-') ||
		info.files[0] === 'headers' ||
		info.files[0] === 'aix-ppc64' ||
		info.files[0].includes('sunos')
	) {
		// linux, headers, and aix
		info.files[0] = `node-v${version}-${info.files[0]}.tar.gz`;
		info.files.push(info.files[0].replace('.tar.gz', '.tar.xz'));
	}

	// handle the types appropriately.
	if (file.includes('osx-')) {
		info.type = 'macos';
	} else if (file.includes('linux-')) {
		info.type = 'linux';
	} else if (file.includes('win-')) {
		info.type = 'windows';
	} else if (file.includes('headers')) {
		info.type = 'headers';
	} else if (file.includes('src')) {
		info.type = 'source';
	} else if (file.includes('aix-ppc64')) {
		info.type = 'aix';
	} else if (file.includes('sunos-x64') || file.includes('sunos-x86')) {
		info.type = 'sunos';
	}

	// some of this is probably wrong but also I'm not familiar enough with
	// architectures and their names to know what's right/wrong.
	//
	// fixes are welcome. I just ask that you keep it relatively nice looking...
	// ugly names are bad dx.
	if (info.id.includes('x86')) {
		info.architecture = 'x86';
	} else if (info.id.includes('x64')) {
		info.architecture = 'x64';
	} else if (info.id.includes('arm64')) {
		info.architecture = 'arm64';
	} else if (info.id.includes('armv7l')) {
		info.architecture = 'armv7l';
	} else if (info.id.includes('armv6l')) {
		info.architecture = 'armv6l';
	} else if (
		info.id.includes('aix-ppc64') ||
		info.files[0].includes('ppc64le')
	) {
		info.architecture = 'power';
	} else if (info.id.includes('s390x')) {
		info.architecture = 'z';
	}

	return info;
}

module.exports = parseFilename;
