/**
 * @file Translates the terms of the Node.js package support document to the
 *   aliases `@nodevu/ranges` takes.
 *
 * @example
 * ```js
 * const translate = require('@nodevu/translate');
 * ```
 */
export = translate;
/**
 * The aliases each package support term covers, ordered from the most recent
 * coverage to the oldest.
 *
 * @example
 * ```js
 * translations.lts; // ['lts/active', 'lts/maintenance']
 * ```
 */
declare const translations: {
    readonly current: readonly ['current'];
    readonly lts_latest: readonly ['lts/latest'];
    readonly lts: readonly ['lts/active', 'lts/maintenance'];
    readonly supported: readonly ['current', 'lts/active', 'lts/maintenance'];
    readonly all: readonly ['current', 'lts/active', 'lts/maintenance', 'eol'];
};
/**
 * Translates a term of the Node.js package support document to the aliases
 * `@nodevu/ranges` takes.
 *
 * @template {keyof typeof translations} Term
 * @param {Term} legacyName The term, such as `'supported'`.
 * @returns {Promise<Array<(typeof translations)[Term][number]>>} The aliases
 *   the term covers, newest first.
 * @public
 * @example
 * ```js
 * const ranges = require('@nodevu/ranges');
 * const translate = require('@nodevu/translate');
 *
 * await translate('supported'); // ['current', 'lts/active', 'lts/maintenance']
 *
 * const supported = await ranges(await translate('supported'));
 * ```
 */
declare function translate<Term extends keyof typeof translations>(legacyName: Term): Promise<Array<(typeof translations)[Term][number]>>;
