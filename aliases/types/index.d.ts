/**
 * @typedef {'alpha' | 'current' | 'lts/latest' | 'lts/active' | 'lts/maintenance' | 'eol' | 'all'} Alias
 */
export = aliases;
export type Alias = 'alpha' | 'current' | 'lts/latest' | 'lts/active' | 'lts/maintenance' | 'eol' | 'all';
/**
 * The names of the ranges of release lines `@nodevu/ranges` works out.
 *
 * @type {Alias[]}
 */
declare const aliases: Alias[];
