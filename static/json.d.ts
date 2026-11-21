/**
 * @file Types the JSON data files of `@nodevu/static` as `unknown`.
 *
 * @example
 * ```js
 * const supportData = require('./data/support.json'); // unknown
 * ```
 */

// the data files are typed where index.js exports them, so they're unknown
// here instead of inferred from megabytes of JSON
declare module '*.json' {
	const value: unknown;
	export = value;
}
