export = opt;
import { DateTime } from 'luxon';
export type Fetch = (url: string) => Promise<{
    ok: boolean;
    status: number;
    statusText: string;
    json: () => Promise<unknown>;
}>;
export type Options = {
    fetch: Fetch;
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
 * The part of `fetch` `@nodevu/core` uses: a GET of a URL whose JSON it
 * reads. Any `fetch` with this shape fits, such as `globalThis.fetch` or
 * undici's. A copy of `@nodevu/fetchindex`'s, since opt doesn't depend on it.
 *
 * @typedef {(url: string) => Promise<{
 *   ok: boolean,
 *   status: number,
 *   statusText: string,
 *   json: () => Promise<unknown>,
 * }>} Fetch
 */
/**
 * @typedef {object} Options
 * @property {Fetch} fetch
 * @property {string | DateTime} now An ISO 8601 date, or a Luxon `DateTime`.
 * @property {{ index: string, schedule: string }} urls
 */
/**
 * Builds the options `@nodevu/core` takes, filling in a default for each one
 * left out.
 *
 * @param {{ fetch?: Fetch, now?: string | DateTime, urls?: { index?: string, schedule?: string } }} [inputOptions]
 * @returns {Options}
 */
declare function opt(inputOptions?: {
    fetch?: Fetch;
    now?: string | DateTime;
    urls?: {
        index?: string;
        schedule?: string;
    };
}): Options;
