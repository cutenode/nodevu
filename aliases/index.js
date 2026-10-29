/**
 * @typedef {'alpha' | 'current' | 'lts/latest' | 'lts/active' | 'lts/maintenance' | 'eol' | 'all'} Alias
 */

/**
 * The names of the ranges of release lines `@nodevu/ranges` works out.
 *
 * @type {Alias[]}
 */
const aliases = [
	'alpha',
	'current',
	'lts/latest',
	'lts/active',
	'lts/maintenance',
	'eol',
	'all',
];

module.exports = aliases;
