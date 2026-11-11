/**
 * The part of `fetch` fetchindex uses: a GET of a URL whose JSON it reads. Any
 * `fetch` with this shape fits, such as `globalThis.fetch` or undici's.
 *
 * @typedef {(url: string) => Promise<{
 *   ok: boolean,
 *   status: number,
 *   statusText: string,
 *   json: () => Promise<unknown>,
 * }>} Fetch
 */
export = versions;
export type Fetch = (url: string) => Promise<{
    ok: boolean;
    status: number;
    statusText: string;
    json: () => Promise<unknown>;
}>;
export type IndexRelease = {
    /**
     * Such as `'v17.6.0'`.
     */
    version: string;
    date: string;
    files: string[];
    npm?: string;
    v8?: string;
    uv?: string;
    zlib?: string;
    openssl?: string;
    modules?: string;
    /**
     * The LTS codename, or `false`.
     */
    lts: string | false;
    security: boolean;
};
/**
 * A release as the Node.js release index lists it.
 *
 * @typedef {object} IndexRelease
 * @property {string} version Such as `'v17.6.0'`.
 * @property {string} date
 * @property {string[]} files
 * @property {string} [npm]
 * @property {string} [v8]
 * @property {string} [uv]
 * @property {string} [zlib]
 * @property {string} [openssl]
 * @property {string} [modules]
 * @property {string | false} lts The LTS codename, or `false`.
 * @property {boolean} security
 */
/**
 * Fetches the Node.js release index.
 *
 * @param {object} options
 * @param {Fetch} options.fetch The `fetch` implementation to use.
 * @param {{ index: string }} options.urls The full URL of the index.
 * @returns {Promise<IndexRelease[]>} Every release, newest first.
 */
declare function versions(options: {
    fetch: Fetch;
    urls: {
        index: string;
    };
}): Promise<IndexRelease[]>;
