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
 * @param {{ fetch: import('../../index').Fetch, urls: { schedule: string } }} options
 * @returns {Promise<Schedule>}
 */
declare function schedule(options: {
    fetch: import('../../index').Fetch;
    urls: {
        schedule: string;
    };
}): Promise<Schedule>;
