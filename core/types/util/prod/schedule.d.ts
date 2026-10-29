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
 * @param {import('./optionsParser').ParsedOptions} options
 * @returns {Promise<Schedule>}
 */
declare function schedule(options: import('./optionsParser').ParsedOptions): Promise<Schedule>;
