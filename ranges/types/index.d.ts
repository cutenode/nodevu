export = generateRanges;
export type Range = {
    /**
     * The versions in the range, newest first.
     */
    versions: string[];
    newest?: string;
    oldest?: string;
    newestLts?: string;
    oldestLts?: string;
    newestSecurity?: string;
    oldestSecurity?: string;
};
/**
 * A range of versions. The fields a range doesn't have, or has nothing to
 * point to, are `undefined`.
 *
 * @typedef {object} Range
 * @property {string[]} versions The versions in the range, newest first.
 * @property {string} [newest]
 * @property {string} [oldest]
 * @property {string} [newestLts]
 * @property {string} [oldestLts]
 * @property {string} [newestSecurity]
 * @property {string} [oldestSecurity]
 */
/**
 * Works out ranges of Node.js versions, named by `@nodevu/aliases`.
 *
 * @param {import('@nodevu/aliases').Alias | readonly import('@nodevu/aliases').Alias[]} [filter]
 *   The ranges to work out. Defaults to `'all'`, every range.
 * @param {import('@nodevu/core').Options} [options] Passed to `@nodevu/core`.
 * @returns {Promise<Partial<Record<import('@nodevu/aliases').Alias, Range>>>}
 *   A key per range. A range with no releases is left out.
 */
declare function generateRanges(filter?: import('@nodevu/aliases').Alias | readonly import('@nodevu/aliases').Alias[], options?: import('@nodevu/core').Options): Promise<Partial<Record<import('@nodevu/aliases').Alias, Range>>>;
