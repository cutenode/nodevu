export = parseOptions;
import { DateTime } from 'luxon';
export type ParsedOptions = {
    fetch: typeof fetch;
    now: string | DateTime;
    urls: {
        index: string;
        schedule: string;
    };
};
/**
 * @typedef {object} ParsedOptions
 * @property {typeof fetch} fetch
 * @property {string | DateTime} now
 * @property {{ index: string, schedule: string }} urls
 */
/**
 * @param {import('../../index').Options} [options]
 * @returns {ParsedOptions}
 */
declare function parseOptions(options?: import('../../index').Options): ParsedOptions;
