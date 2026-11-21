/**
 * @file Builds the options `@nodevu/core` takes, filling in a default for each one left out.
 *
 * @example
 * ```js
 * import opt from '@nodevu/opt';
 *
 * const options = opt({ now: '2025-10-30' });
 * ```
 */
export = opt;
import { DateTime } from 'luxon';
export type Fetch = (url: string) => Promise<{
    ok: boolean;
    status: number;
    statusText: string;
    json: () => Promise<unknown>;
}>;
export type Options = {
    /**
     * The `fetch` implementation to request the data with.
     */
    fetch: Fetch;
    /**
     * An ISO 8601 date, or a Luxon `DateTime`.
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
 * The part of `fetch` `@nodevu/core` uses: a GET of a URL whose JSON it
 * reads. Any `fetch` with this shape fits, such as `globalThis.fetch` or
 * undici's. A copy of `@nodevu/fetchindex`'s, since opt doesn't depend on it.
 *
 * @public
 * @example
 * ```js
 * import { fetch } from 'undici';
 *
 * const options = opt({ fetch });
 * ```
 *
 * @typedef {(url: string) => Promise<{
 *   ok: boolean,
 *   status: number,
 *   statusText: string,
 *   json: () => Promise<unknown>,
 * }>} Fetch
 */
/**
 * The options `@nodevu/core` takes, with every one set.
 *
 * @public
 * @example
 * ```js
 * const options = opt();
 * options.urls.index; // 'https://nodejs.org/dist/index.json'
 * ```
 *
 * @typedef {object} Options
 * @property {Fetch} fetch The `fetch` implementation to request the data with.
 * @property {string | DateTime} now An ISO 8601 date, or a Luxon `DateTime`.
 * @property {{ index: string, schedule: string }} urls The full URLs of the
 *   release index and release schedule.
 */
/**
 * Builds the options `@nodevu/core` takes, filling in a default for each one
 * left out.
 *
 * @public
 * @example
 * ```js
 * const options = opt({ urls: { index: 'https://example.com/index.json' } });
 *
 * options.urls.index; // 'https://example.com/index.json'
 * options.urls.schedule; // 'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json'
 * ```
 *
 * @param {{ fetch?: Fetch, now?: string | DateTime, urls?: { index?: string, schedule?: string } }} [inputOptions]
 *   The caller's options.
 * @returns {Options} The options, each one set.
 */
declare function opt(inputOptions?: {
    fetch?: Fetch;
    now?: string | DateTime;
    urls?: {
        index?: string;
        schedule?: string;
    };
}): Options;
