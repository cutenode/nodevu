/**
 * @file Works out ranges of Node.js versions, named by `@nodevu/aliases`.
 *
 * @example
 * ```js
 * const ranges = require('@nodevu/ranges');
 * ```
 */
export = generateRanges;
export type Range = {
    /**
     * The versions in the range, newest first.
     */
    versions: string[];
    /**
     * The newest version in the range.
     */
    newest?: string;
    /**
     * The oldest version in the range.
     */
    oldest?: string;
    /**
     * The newest LTS release.
     */
    newestLts?: string;
    /**
     * The first LTS release of the oldest line.
     */
    oldestLts?: string;
    /**
     * The newest security release.
     */
    newestSecurity?: string;
    /**
     * The oldest security release of the
     * oldest line.
     */
    oldestSecurity?: string;
};
/**
 * A range of versions. The fields a range doesn't have, or has nothing to
 * point to, are `undefined`. `versions`, `newest` and `oldest`, and the `all`
 * range's `newestLts` and `newestSecurity`, have a `v`; the other LTS and
 * security fields come from `@nodevu/core` without one.
 *
 * @public
 * @example
 * ```js
 * const ranges = require('@nodevu/ranges');
 *
 * const { eol } = await ranges('eol');
 *
 * eol.versions.at(-1) === eol.oldest; // true
 * ```
 *
 * @typedef {object} Range
 * @property {string[]} versions The versions in the range, newest first.
 * @property {string} [newest] The newest version in the range.
 * @property {string} [oldest] The oldest version in the range.
 * @property {string} [newestLts] The newest LTS release.
 * @property {string} [oldestLts] The first LTS release of the oldest line.
 * @property {string} [newestSecurity] The newest security release.
 * @property {string} [oldestSecurity] The oldest security release of the
 *   oldest line.
 */
/**
 * Works out ranges of Node.js versions, named by `@nodevu/aliases`.
 *
 * @param {import('@nodevu/aliases').Alias | readonly import('@nodevu/aliases').Alias[]} [filter]
 *   The ranges to work out. Defaults to `'all'`, every range.
 * @param {import('@nodevu/core').Options} [options] Passed to `@nodevu/core`.
 * @returns {Promise<Partial<Record<import('@nodevu/aliases').Alias, Range>>>}
 *   A key per range. A range with no releases is left out.
 * @public
 * @example
 * ```js
 * const ranges = require('@nodevu/ranges');
 *
 * const { eol } = await ranges(['eol']);
 *
 * eol.oldest; // 'v0.8.0'
 * eol.newestSecurity; // undefined, `eol` has no security fields
 * ```
 */
declare function generateRanges(filter?: import('@nodevu/aliases').Alias | readonly import('@nodevu/aliases').Alias[], options?: import('@nodevu/core').Options): Promise<Partial<Record<import('@nodevu/aliases').Alias, Range>>>;
