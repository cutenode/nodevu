declare const _exports: {
    at: typeof at;
};
export = _exports;
/**
 * Returns options for `@nodevu/core`, and the packages built on it, that serve
 * `data` instead of fetching it. Its index.json only has the releases that
 * were out by `now`, like the real one. Any other URL throws, so tests never
 * touch the network.
 *
 * `now` defaults to 2025-09-01, picked so that current, active LTS,
 * maintenance LTS and end of life each have a release line, and each of those
 * lines already has a security release, so no range or security field is
 * empty.
 *
 * @param {string} [now] The date to serve the data as of, such as
 *   `'2025-09-01'`.
 * @param {{ index: { date: string }[], schedule: unknown }} [data] The
 *   index.json and schedule.json to serve. Defaults to the snapshots.
 * @returns {{ now: string, fetch: typeof fetch }} The `now` and `fetch`
 *   options.
 */
declare function at(now?: string, data?: {
    index: {
        date: string;
    }[];
    schedule: unknown;
}): {
    now: string;
    fetch: typeof fetch;
};
