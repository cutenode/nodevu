/**
 * @file Fills in the defaults for the options `@nodevu/core` takes.
 *
 * @example
 * ```js
 * const optionsParser = require('./util/prod/optionsParser');
 *
 * const parsedOptions = optionsParser({ now: '2025-10-30' });
 * ```
 */
export = parseOptions;
import { DateTime } from 'luxon';
export type ParsedOptions = {
    /**
     * The `fetch` implementation to
     * request the data with.
     */
    fetch: import('../../index').Fetch;
    /**
     * The date to work out each release line's
     * phase against.
     */
    now: string | DateTime;
    /**
     * The full URLs of the
     * release index and release schedule.
     */
    urls: {
        index: string;
        schedule: string;
    };
};
/**
 * Core's options with every default filled in, so nothing downstream checks for a missing one.
 *
 * @public
 * @example
 * ```js
 * const { urls } = optionsParser();
 * urls.index; // 'https://nodejs.org/dist/index.json'
 * ```
 *
 * @typedef {object} ParsedOptions
 * @property {import('../../index').Fetch} fetch The `fetch` implementation to
 *   request the data with.
 * @property {string | DateTime} now The date to work out each release line's
 *   phase against.
 * @property {{ index: string, schedule: string }} urls The full URLs of the
 *   release index and release schedule.
 */
/**
 * Fills in a default for each option the caller left out.
 *
 * @public
 * @example
 * ```js
 * const parsedOptions = optionsParser({ now: '2025-10-30' });
 *
 * parsedOptions.now; // '2025-10-30'
 * parsedOptions.fetch === globalThis.fetch; // true
 * ```
 *
 * @param {import('../../index').Options} [options] The caller's options.
 * @returns {ParsedOptions} The options, each one set.
 */
declare function parseOptions(options?: import('../../index').Options): ParsedOptions;
