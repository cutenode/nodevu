// ordered from most recent coverage to oldest coverage
const translations = {
	current: ['current'],
	lts_latest: ['lts/latest'],
	lts: ['lts/active', 'lts/maintenance'],
	supported: ['current', 'lts/active', 'lts/maintenance'],
	all: ['current', 'lts/active', 'lts/maintenance', 'eol'],
};

async function translate(legacyName) {
	if (!translations[legacyName]) {
		throw new Error(`Unknown value: ${legacyName}`);
	}

	return translations[legacyName];
}

module.exports = translate;
