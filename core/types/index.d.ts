/**
 * @file Fetches the Node.js release index and schedule and merges them into one object keyed by release line.
 *
 * @example
 * ```js
 * const core = require('@nodevu/core');
 *
 * const data = await core();
 * data.v20.support.codename; // 'Iron'
 * ```
 */
export = core;
export type Fetch = import('@nodevu/fetchindex').Fetch;
export type Options = {
    /**
     * The `fetch` implementation to request the
     * data with. Defaults to `globalThis.fetch`.
     */
    fetch?: Fetch;
    /**
     * An ISO 8601 date to work
     * out each release line's phase against. Defaults to now.
     */
    now?: string | import('luxon').DateTime;
    /**
     * The URLs to fetch the data from. Each defaults to
     * the one nodejs.org or the nodejs/Release repo publishes.
     */
    urls?: {
        index?: string;
        schedule?: string;
    };
};
export type Phase = 'alpha' | 'start' | 'lts' | 'maintenance' | 'end';
export type PhaseDates = {
    alpha?: string;
    start?: string;
    lts?: string;
    maintenance?: string;
    end?: string;
};
export type Support = {
    /**
     * The LTS codename, such as `'Iron'`.
     */
    codename?: string;
    /**
     * The newest and first
     * releases flagged as LTS.
     */
    lts?: {
        newest?: string;
        oldest?: string;
    };
    /**
     * The line's phase dates and the phase it's in.
     */
    phases: {
        dates: PhaseDates;
        current: Phase | Record<string, never>;
    };
};
export type Security = {
    /**
     * Every security release in the line, newest first.
     */
    all: string[];
    /**
     * The newest security release, if the line has one.
     */
    newest?: string;
    /**
     * The first security release, if the line has one.
     */
    oldest?: string;
};
export type FileLink = {
    /**
     * The identifier, such as `'linux-x64'`.
     */
    id: string;
    /**
     * The file names for the identifier.
     */
    files: string[];
    /**
     * The architecture, such as `'x64'`.
     */
    architecture?: string;
};
export type Release = {
    /**
     * The parts of the version.
     */
    semver: {
        raw: string;
        major: number;
        minor: number;
        patch: number;
        line: string;
    };
    /**
     * Such as `'2022-02-22'`.
     */
    releaseDate?: string;
    /**
     * The ABI version.
     */
    modules: {
        version?: string;
    };
    /**
     * The versions of the bundled dependencies.
     */
    dependencies: {
        npm?: string;
        v8?: string;
        uv?: string;
        zlib?: string;
        openssl?: string;
    };
    /**
     * The files the release ships.
     */
    files: {
        available: string[];
        links: Record<string, FileLink[]>;
    };
    /**
     * Whether the release is an LTS release.
     */
    lts: {
        isLts: boolean;
    };
    /**
     * Whether the release is an Alpha release.
     */
    alpha: {
        isAlpha: boolean;
    };
    /**
     * Whether the release is a
     * security release.
     */
    security: {
        isSecurity: boolean;
    };
};
export type ReleaseLine = {
    /**
     * Every release in the line,
     * newest first, keyed by version, such as `v17.6.0`.
     */
    releases: Record<string, Release>;
    /**
     * Only present when the release schedule has a
     * start date for the line.
     */
    support?: Support;
    /**
     * The line's security releases.
     */
    security: Security;
};
export type Data = Record<string, ReleaseLine>;
/**
 * The part of `fetch` core uses, which `@nodevu/fetchindex` defines.
 *
 * @public
 * @example
 * ```js
 * const { fetch } = require('undici');
 *
 * const data = await core({ fetch });
 * ```
 *
 * @typedef {import('@nodevu/fetchindex').Fetch} Fetch
 */
/**
 * What `core` takes: where to fetch the data from, and the date to work out phases on.
 *
 * @public
 * @example
 * ```js
 * const data = await core({
 *   now: '2025-10-30',
 *   urls: { schedule: 'https://example.com/schedule.json' },
 * });
 * ```
 *
 * @typedef {object} Options
 * @property {Fetch} [fetch] The `fetch` implementation to request the
 *   data with. Defaults to `globalThis.fetch`.
 * @property {string | import('luxon').DateTime} [now] An ISO 8601 date to work
 *   out each release line's phase against. Defaults to now.
 * @property {object} [urls] The URLs to fetch the data from. Each defaults to
 *   the one nodejs.org or the nodejs/Release repo publishes.
 * @property {string} [urls.index] The full URL of the release index.
 * @property {string} [urls.schedule] The full URL of the release schedule.
 */
/**
 * A stage of a release line's life, in the order a line goes through them.
 *
 * @public
 * @example
 * ```js
 * const data = await core({ now: '2025-10-30' });
 * data.v20.support.phases.current; // 'maintenance'
 * ```
 *
 * @typedef {'alpha' | 'start' | 'lts' | 'maintenance' | 'end'} Phase
 */
/**
 * The start date of each phase of a release line, such as `'2021-04-20'`.
 *
 * @public
 * @example
 * ```js
 * const data = await core();
 * data.v20.support.phases.dates;
 * // { start: '2023-04-18', lts: '2023-10-24', maintenance: '2024-10-22', end: '2026-04-30' }
 * ```
 *
 * @typedef {object} PhaseDates
 * @property {string} [alpha]
 * @property {string} [start]
 * @property {string} [lts]
 * @property {string} [maintenance]
 * @property {string} [end]
 */
/**
 * A release line's codename, LTS range, and phase dates from the release schedule.
 *
 * @public
 * @example
 * ```js
 * const data = await core({ now: '2025-10-30' });
 * data.v20.support.codename; // 'Iron'
 * data.v20.support.lts.oldest; // '20.9.0'
 * ```
 *
 * @typedef {object} Support
 * @property {string} [codename] The LTS codename, such as `'Iron'`.
 * @property {{ newest?: string, oldest?: string }} [lts] The newest and first
 *   releases flagged as LTS.
 * @property {object} phases The line's phase dates and the phase it's in.
 * @property {PhaseDates} phases.dates The start date of each phase.
 * @property {Phase | Record<string, never>} phases.current The phase the line
 *   is in on `now`, or an empty object when none has started yet.
 */
/**
 * The security releases of a release line.
 *
 * @public
 * @example
 * ```js
 * const data = await core();
 * data.v20.security.all.includes(data.v20.security.newest); // true
 * ```
 *
 * @typedef {object} Security
 * @property {string[]} all Every security release in the line, newest first.
 * @property {string} [newest] The newest security release, if the line has one.
 * @property {string} [oldest] The first security release, if the line has one.
 */
/**
 * The files of one identifier from a release's `files`.
 *
 * @public
 * @example
 * ```js
 * const data = await core();
 * data.v20.releases['v20.19.5'].files.links.linux[0];
 * // { id: 'linux-arm64', files: ['node-v20.19.5-linux-arm64.tar.gz', 'node-v20.19.5-linux-arm64.tar.xz'], architecture: 'arm64' }
 * ```
 *
 * @typedef {object} FileLink
 * @property {string} id The identifier, such as `'linux-x64'`.
 * @property {string[]} files The file names for the identifier.
 * @property {string} [architecture] The architecture, such as `'x64'`.
 */
/**
 * One Node.js release: its version, date, bundled dependencies, files, and LTS and security flags.
 *
 * @public
 * @example
 * ```js
 * const data = await core();
 * const release = data.v20.releases['v20.19.5'];
 *
 * release.dependencies.npm; // '10.8.2'
 * release.lts.isLts; // true
 * ```
 *
 * @typedef {object} Release
 * @property {object} semver The parts of the version.
 * @property {string} semver.raw The version without its `v`.
 * @property {number} semver.major
 * @property {number} semver.minor
 * @property {number} semver.patch
 * @property {string} semver.line The release line, such as `'v17'`.
 * @property {string} [releaseDate] Such as `'2022-02-22'`.
 * @property {{ version?: string }} modules The ABI version.
 * @property {object} dependencies The versions of the bundled dependencies.
 * @property {string} [dependencies.npm]
 * @property {string} [dependencies.v8]
 * @property {string} [dependencies.uv]
 * @property {string} [dependencies.zlib]
 * @property {string} [dependencies.openssl]
 * @property {object} files The files the release ships.
 * @property {string[]} files.available The identifiers the index lists.
 * @property {Record<string, FileLink[]>} files.links The files of each
 *   identifier, grouped by type, such as `linux` or `windows`.
 * @property {{ isLts: boolean }} lts Whether the release is an LTS release.
 * @property {{ isAlpha: boolean }} alpha Whether the release is an Alpha release.
 * @property {{ isSecurity: boolean }} security Whether the release is a
 *   security release.
 */
/**
 * A major release line (or minor, before `v1`): its releases, support, and security releases.
 *
 * @public
 * @example
 * ```js
 * const data = await core();
 * Object.keys(data.v20.releases)[0]; // the newest v20 release, such as 'v20.19.5'
 * ```
 *
 * @typedef {object} ReleaseLine
 * @property {Record<string, Release>} releases Every release in the line,
 *   newest first, keyed by version, such as `v17.6.0`.
 * @property {Support} [support] Only present when the release schedule has a
 *   start date for the line.
 * @property {Security} security The line's security releases.
 */
/**
 * Every release line, newest first, keyed by name, such as `v22` or `v0.10`.
 *
 * @public
 * @example
 * ```js
 * const data = await core();
 * Object.keys(data).at(-1); // 'v0.1'
 * ```
 *
 * @typedef {Record<string, ReleaseLine>} Data
 */
/**
 * Fetches the Node.js release index and release schedule and merges them into
 * one object keyed by release line. Rejects when `now` isn't a date, or when
 * the index has a version semver can't read.
 *
 * @public
 * @example
 * ```js
 * const core = require('@nodevu/core');
 *
 * const data = await core({ now: '2025-10-30' });
 * data.v22.support.phases.current; // 'maintenance'
 * ```
 *
 * @param {Options} [options] Where to fetch the data from, and the date to
 *   work out each release line's phase on.
 * @returns {Promise<Data>} Every release line, keyed by name.
 */
declare function core(options?: Options): Promise<Data>;
