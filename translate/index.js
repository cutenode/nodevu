/**
 * @file Translates the terms of the Node.js package support document to the
 *   aliases `@nodevu/ranges` takes.
 *
 * @example
 * ```js
 * const translate = require('@nodevu/translate');
 * ```
 */

/**
 * The aliases each package support term covers, ordered from the most recent
 * coverage to the oldest.
 *
 * @example
 * ```js
 * translations.lts; // ['lts/active', 'lts/maintenance']
 * ```
 */
const translations = /** @type {const} */ ({
	current: ['current'],
	lts_latest: ['lts/latest'],
	lts: ['lts/active', 'lts/maintenance'],
	supported: ['current', 'lts/active', 'lts/maintenance'],
	all: ['current', 'lts/active', 'lts/maintenance', 'eol'],
});

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
async function translate(legacyName) {
	// an own-property check, so names like `toString` don't resolve to
	// Object.prototype's members
	if (!Object.hasOwn(translations, legacyName)) {
		throw new Error(`Unknown value: ${legacyName}`);
	}

	// a copy, so a caller changing the result can't change later results
	return [...translations[legacyName]];
}

module.exports = translate;
