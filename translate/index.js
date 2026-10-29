// ordered from most recent coverage to oldest coverage
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
 * @returns {Promise<(typeof translations)[Term]>}
 */
async function translate(legacyName) {
	if (!translations[legacyName]) {
		throw new Error(`Unknown value: ${legacyName}`);
	}

	return translations[legacyName];
}

module.exports = translate;
