/**
 * @file The data `@nodevu/core` returns, and subsets of it, shipped as JSON.
 *
 * @example
 * ```js
 * const { default: data, support } = require('@nodevu/static');
 * ```
 */

const defaultData = require('./data/default.json');
const releasesData = require('./data/releases.json');
const securityData = require('./data/security.json');
const supportData = require('./data/support.json');

/**
 * Everything `@nodevu/core` returns.
 *
 * @public
 * @example
 * ```js
 * const { default: data } = require('@nodevu/static');
 *
 * data.v16.security.newest; // '16.20.2'
 * ```
 */
module.exports.default = /** @type {import('@nodevu/core').Data} */ (
	defaultData
);

/**
 * The releases of each release line.
 *
 * @public
 * @example
 * ```js
 * const { releases } = require('@nodevu/static');
 *
 * releases.v17['v17.6.0'].releaseDate; // '2022-02-22'
 * ```
 */
module.exports.releases =
	/** @type {Record<string, import('@nodevu/core').ReleaseLine['releases']>} */ (
		releasesData
	);

/**
 * The security releases of each release line.
 *
 * @public
 * @example
 * ```js
 * const { security } = require('@nodevu/static');
 *
 * security.v16.oldest; // '16.4.1'
 * ```
 */
module.exports.security =
	/** @type {Record<string, import('@nodevu/core').Security>} */ (securityData);

/**
 * The support phases of each release line the release schedule lists.
 *
 * @public
 * @example
 * ```js
 * const { support } = require('@nodevu/static');
 *
 * support.v20.codename; // 'Iron'
 * ```
 */
module.exports.support =
	/** @type {Record<string, import('@nodevu/core').Support>} */ (supportData);
