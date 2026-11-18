/**
 * The Node.js release schedule, keyed by release line.
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
 * Fetches the Node.js release schedule.
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
