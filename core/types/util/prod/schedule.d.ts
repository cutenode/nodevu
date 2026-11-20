/**
 * @file Fetches the Node.js release schedule from the nodejs/Release repo.
 *
 * @example
 * ```js
 * const scheduleFetcher = require('./util/prod/schedule');
 *
 * const schedule = await scheduleFetcher(optionsParser());
 * ```
 */
export = schedule;
export type Schedule = Record<string, {
    alpha?: string;
    start?: string;
    lts?: string;
    maintenance?: string;
    end?: string;
    codename?: string;
}>;
/**
 * The Node.js release schedule, keyed by release line.
 *
 * @public
 * @example
 * ```js
 * const schedule = await scheduleFetcher(optionsParser());
 * schedule.v20;
 * // { start: '2023-04-18', lts: '2023-10-24', maintenance: '2024-10-22', end: '2026-04-30', codename: 'Iron' }
 * ```
 *
 * @typedef {Record<string, {
 *   alpha?: string,
 *   start?: string,
 *   lts?: string,
 *   maintenance?: string,
 *   end?: string,
 *   codename?: string,
 * }>} Schedule
 */
/**
 * Fetches the Node.js release schedule. Rejects when the response isn't OK.
 *
 * @public
 * @example
 * ```js
 * const schedule = await scheduleFetcher({
 *   fetch: globalThis.fetch,
 *   urls: { schedule: 'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json' },
 * });
 * schedule.v22.codename; // 'Jod'
 * ```
 *
 * @param {{ fetch: import('../../index').Fetch, urls: { schedule: string } }} options
 *   The `fetch` implementation to use, and the full URL of the schedule.
 * @returns {Promise<Schedule>} The schedule, keyed by release line.
 */
declare function schedule(options: {
    fetch: import('../../index').Fetch;
    urls: {
        schedule: string;
    };
}): Promise<Schedule>;
