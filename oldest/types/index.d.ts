/**
 * @file Finds the oldest LTS or security release of a Node.js release line.
 *
 * @example
 * ```js
 * const { lts, security } = require('@nodevu/oldest');
 * ```
 */
export { oldest };
export { lts };
export { security };
/**
 * Finds the oldest LTS or security release of a release line.
 *
 * @param {string} name The release line, such as `'v16'` or `'v0.10'`.
 * @param {'lts' | 'security'} type Which kind of release to find.
 * @param {import('@nodevu/core').Options} [options] Passed to `@nodevu/core`.
 * @returns {Promise<string | undefined>} The version without its `v`, or
 *   `undefined` when the line has no such release.
 * @public
 * @example
 * ```js
 * const { oldest } = require('@nodevu/oldest');
 *
 * await oldest('v16', 'lts'); // '16.13.0'
 * await oldest('v16', 'security'); // '16.4.1'
 * ```
 */
declare function oldest(name: string, type: 'lts' | 'security', options?: import('@nodevu/core').Options): Promise<string | undefined>;
/**
 * Finds the oldest LTS release of a release line.
 *
 * @param {string} name The release line, such as `'v16'`.
 * @param {import('@nodevu/core').Options} [options] Passed to `@nodevu/core`.
 * @returns {Promise<string | undefined>} The version without its `v`, or
 *   `undefined` when the line has no LTS release.
 * @public
 * @example
 * ```js
 * const { lts } = require('@nodevu/oldest');
 *
 * await lts('v16'); // '16.13.0'
 * await lts('v25'); // undefined
 * ```
 */
declare function lts(name: string, options?: import('@nodevu/core').Options): Promise<string | undefined>;
/**
 * Finds the oldest security release of a release line.
 *
 * @param {string} name The release line, such as `'v16'`.
 * @param {import('@nodevu/core').Options} [options] Passed to `@nodevu/core`.
 * @returns {Promise<string | undefined>} The version without its `v`, or
 *   `undefined` when the line has no security release.
 * @public
 * @example
 * ```js
 * const { security } = require('@nodevu/oldest');
 *
 * await security('v16'); // '16.4.1'
 * ```
 */
declare function security(name: string, options?: import('@nodevu/core').Options): Promise<string | undefined>;
