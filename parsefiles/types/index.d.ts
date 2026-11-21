/**
 * @file Parses an identifier from a release's `files` in the Node.js release index into file names.
 *
 * @example
 * ```js
 * const parsefiles = require('@nodevu/parsefiles');
 *
 * parsefiles('linux-x64', '22.11.0').files;
 * // ['node-v22.11.0-linux-x64.tar.gz', 'node-v22.11.0-linux-x64.tar.xz']
 * ```
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
    /**
     * The CPU architecture the files are built for, if they're built for one.
     */
    architecture?: 'x86' | 'x64' | 'arm64' | 'armv7l' | 'armv6l' | 'power' | 'z';
};
/**
 * An identifier's file names, platform, and architecture.
 *
 * @public
 * @example
 * ```js
 * parsefiles('osx-arm64-tar', '22.11.0');
 * // { id: 'osx-arm64-tar', files: ['node-v22.11.0-darwin-arm64.tar.gz'], type: 'macos', architecture: 'arm64' }
 * ```
 *
 * @typedef {object} ParsedFile
 * @property {string} id The identifier passed in, such as `'linux-x64'`.
 * @property {string[]} files The file names that should exist for the
 *   identifier.
 * @property {'aix' | 'headers' | 'linux' | 'macos' | 'source' | 'sunos' | 'windows'} [type]
 *   The platform, or what kind of files these are.
 * @property {'x86' | 'x64' | 'arm64' | 'armv7l' | 'armv6l' | 'power' | 'z'} [architecture]
 *   The CPU architecture the files are built for, if they're built for one.
 */
/**
 * Parses an identifier from a release's `files` in the Node.js release index.
 *
 * @public
 * @example
 * ```js
 * parsefiles('win-x64-msi', '22.11.0');
 * // { id: 'win-x64-msi', files: ['node-v22.11.0-x64.msi'], type: 'windows', architecture: 'x64' }
 * ```
 *
 * @param {string} file An identifier, such as `'win-x64-msi'`.
 * @param {string} version The release's version, without its `v`.
 * @returns {ParsedFile} The file names the identifier stands for, and its
 *   platform and architecture.
 */
declare function parseFilename(file: string, version: string): ParsedFile;
