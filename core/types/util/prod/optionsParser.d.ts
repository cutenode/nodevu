export = parseOptions;
import { DateTime } from 'luxon';
export type ParsedOptions = {
    fetch: import('../../index').Fetch;
    now: string | DateTime;
    urls: {
        index: string;
        schedule: string;
    };
};
/**
 * @typedef {object} ParsedOptions
 * @property {import('../../index').Fetch} fetch
 * @property {string | DateTime} now
 * @property {{ index: string, schedule: string }} urls
 */
/**
 * Fills in a default for each option the caller left out.
 *
 * @param {import('../../index').Options} [options] The caller's options.
 * @returns {ParsedOptions} The options, each one set.
 */
declare function parseOptions(options?: import('../../index').Options): ParsedOptions;
