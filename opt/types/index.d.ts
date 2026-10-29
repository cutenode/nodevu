export = opt;
import { DateTime } from 'luxon';
export type Options = {
    fetch: typeof fetch;
    /**
     * An ISO 8601 date, or a Luxon `DateTime`.
     */
    now: string | DateTime;
    urls: {
        index: string;
        schedule: string;
    };
};
/**
 * @typedef {object} Options
 * @property {typeof fetch} fetch
 * @property {string | DateTime} now An ISO 8601 date, or a Luxon `DateTime`.
 * @property {{ index: string, schedule: string }} urls
 */
/**
 * Builds the options `@nodevu/core` takes, filling in a default for each one
 * left out.
 *
 * @param {{ fetch?: typeof fetch, now?: string | DateTime, urls?: { index?: string, schedule?: string } }} [inputOptions]
 * @returns {Options}
 */
declare function opt(inputOptions?: {
    fetch?: typeof fetch;
    now?: string | DateTime;
    urls?: {
        index?: string;
        schedule?: string;
    };
}): Options;
