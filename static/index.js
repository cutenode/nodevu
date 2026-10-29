const defaultData = require('./data/default.json');
const releasesData = require('./data/releases.json');
const securityData = require('./data/security.json');
const supportData = require('./data/support.json');

/**
 * Everything `@nodevu/core` returns.
 */
module.exports.default = /** @type {import('@nodevu/core').Data} */ (
	defaultData
);

/**
 * The releases of each release line.
 */
module.exports.releases =
	/** @type {Record<string, import('@nodevu/core').ReleaseLine['releases']>} */ (
		releasesData
	);

/**
 * The security releases of each release line.
 */
module.exports.security =
	/** @type {Record<string, import('@nodevu/core').Security>} */ (securityData);

/**
 * The support phases of each release line the release schedule lists.
 */
module.exports.support =
	/** @type {Record<string, import('@nodevu/core').Support>} */ (supportData);
