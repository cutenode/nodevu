/**
 * @file Prints the ranges each package support term translates to.
 *
 * @example
 * ```js
 * // from the repo root, same as `node translate/examples/default.js`
 * require('./translate/examples/default.js');
 * ```
 */

const ranges = require('@nodevu/ranges');
const translate = require('../index'); // would normally be "const translate = require('@nodevu/translate')" in your code

/**
 * Works out the ranges of every package support term, one `@nodevu/ranges`
 * call per term.
 *
 * @returns {Promise<Record<Parameters<typeof translate>[0], Awaited<ReturnType<typeof ranges>>>>}
 *   The ranges, keyed by term.
 * @example
 * ```js
 * const { supported } = await getTranslatedData();
 * ```
 */
async function getTranslatedData() {
	// translation for the 'current' Package Support term
	const translatedCurrent = await ranges(await translate('current'));

	// translation for the 'lts_latest' Package Support term
	const translatedLtsLatest = await ranges(await translate('lts_latest'));

	// translation for the 'lts' Package Support term
	const translatedLts = await ranges(await translate('lts'));

	// translation for the 'supported' Package Support term
	const translatedSupported = await ranges(await translate('supported'));

	// translation for the 'all' Package Support term
	const translatedAll = await ranges(await translate('all'));

	// return the data in a single object
	return {
		current: translatedCurrent,
		lts_latest: translatedLtsLatest,
		lts: translatedLts,
		supported: translatedSupported,
		all: translatedAll,
	};
}

getTranslatedData().then(console.log);
