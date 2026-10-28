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
 */
declare function oldest(name: string, type: 'lts' | 'security', options?: import('@nodevu/core').Options): Promise<string | undefined>;
/**
 * Finds the oldest LTS release of a release line.
 *
 * @param {string} name The release line, such as `'v16'`.
 * @param {import('@nodevu/core').Options} [options] Passed to `@nodevu/core`.
 * @returns {Promise<string | undefined>}
 */
declare function lts(name: string, options?: import('@nodevu/core').Options): Promise<string | undefined>;
/**
 * Finds the oldest security release of a release line.
 *
 * @param {string} name The release line, such as `'v16'`.
 * @param {import('@nodevu/core').Options} [options] Passed to `@nodevu/core`.
 * @returns {Promise<string | undefined>}
 */
declare function security(name: string, options?: import('@nodevu/core').Options): Promise<string | undefined>;
