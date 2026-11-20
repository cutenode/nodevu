/**
 * @file The aliases nodevu names ranges of Node.js release lines by.
 *
 * @example
 * ```js
 * const aliases = require('@nodevu/aliases');
 * ```
 */
export = aliases;
export type Alias = 'alpha' | 'current' | 'lts/latest' | 'lts/active' | 'lts/maintenance' | 'eol' | 'all';
/**
 * The name of a range of release lines, such as every line in LTS.
 *
 * @public
 * @example
 * ```js
 * const alias = 'lts/active';
 * ```
 *
 * @typedef {'alpha' | 'current' | 'lts/latest' | 'lts/active' | 'lts/maintenance' | 'eol' | 'all'} Alias
 */
/**
 * The names of the ranges of release lines `@nodevu/ranges` works out.
 *
 * @public
 * @example
 * ```js
 * const aliases = require('@nodevu/aliases');
 *
 * aliases.includes('lts/active'); // true
 * ```
 *
 * @type {Alias[]}
 */
declare const aliases: Alias[];
