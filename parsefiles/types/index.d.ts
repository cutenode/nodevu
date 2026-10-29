/**
 * @typedef {object} ParsedFile
 * @property {string} id The identifier passed in, such as `'linux-x64'`.
 * @property {string[]} files The file names that should exist for the
 *   identifier.
 * @property {'aix' | 'headers' | 'linux' | 'macos' | 'source' | 'sunos' | 'windows'} [type]
 *   The platform, or what kind of files these are.
 * @property {'x86' | 'x64' | 'arm64' | 'armv7l' | 'armv6l' | 'power' | 'z'} [architecture]
 */
export = parseFilename;
export type ParsedFile = {
    /**
     * The identifier passed in, such as `'linux-x64'`.
     */
    id: string;
    /**
     * The file names that should exist for the
     * identifier.
     */
    files: string[];
    /**
     * The platform, or what kind of files these are.
     */
    type?: 'aix' | 'headers' | 'linux' | 'macos' | 'source' | 'sunos' | 'windows';
    architecture?: 'x86' | 'x64' | 'arm64' | 'armv7l' | 'armv6l' | 'power' | 'z';
};
/**
 * Parses an identifier from the `files` of a release in the Node.js release
 * index into the file names it stands for, its platform, and its architecture.
 *
 * @param {string} file An identifier, such as `'win-x64-msi'`.
 * @param {string} version The release's version, without its `v`.
 * @returns {ParsedFile}
 */
declare function parseFilename(file: string, version: string): ParsedFile;
