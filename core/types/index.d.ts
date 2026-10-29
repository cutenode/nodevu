export = core;
export type Options = {
    /**
     * The `fetch` implementation to request the
     * data with. Defaults to `globalThis.fetch`.
     */
    fetch?: typeof fetch;
    /**
     * An ISO 8601 date to work
     * out each release line's phase against. Defaults to now.
     */
    now?: string | import('luxon').DateTime;
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
    newest?: string;
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
    files: {
        available: string[];
        links: Record<string, FileLink[]>;
    };
    lts: {
        isLts: boolean;
    };
    alpha: {
        isAlpha: boolean;
    };
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
    security: Security;
};
export type Data = Record<string, ReleaseLine>;
/**
 * @typedef {object} Options
 * @property {typeof fetch} [fetch] The `fetch` implementation to request the
 *   data with. Defaults to `globalThis.fetch`.
 * @property {string | import('luxon').DateTime} [now] An ISO 8601 date to work
 *   out each release line's phase against. Defaults to now.
 * @property {object} [urls]
 * @property {string} [urls.index] The full URL of the release index.
 * @property {string} [urls.schedule] The full URL of the release schedule.
 */
/**
 * @typedef {'alpha' | 'start' | 'lts' | 'maintenance' | 'end'} Phase
 */
/**
 * The start date of each phase of a release line, such as `'2021-04-20'`.
 *
 * @typedef {object} PhaseDates
 * @property {string} [alpha]
 * @property {string} [start]
 * @property {string} [lts]
 * @property {string} [maintenance]
 * @property {string} [end]
 */
/**
 * @typedef {object} Support
 * @property {string} [codename] The LTS codename, such as `'Iron'`.
 * @property {{ newest?: string, oldest?: string }} [lts] The newest and first
 *   releases flagged as LTS.
 * @property {object} phases
 * @property {PhaseDates} phases.dates
 * @property {Phase | Record<string, never>} phases.current The phase the line
 *   is in on `now`, or an empty object when none has started yet.
 */
/**
 * @typedef {object} Security
 * @property {string[]} all Every security release in the line, newest first.
 * @property {string} [newest]
 * @property {string} [oldest]
 */
/**
 * The files of one identifier from a release's `files`.
 *
 * @typedef {object} FileLink
 * @property {string} id The identifier, such as `'linux-x64'`.
 * @property {string[]} files The file names for the identifier.
 * @property {string} [architecture] The architecture, such as `'x64'`.
 */
/**
 * @typedef {object} Release
 * @property {object} semver
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
 * @property {object} files
 * @property {string[]} files.available The identifiers the index lists.
 * @property {Record<string, FileLink[]>} files.links The files of each
 *   identifier, grouped by type, such as `linux` or `windows`.
 * @property {{ isLts: boolean }} lts
 * @property {{ isAlpha: boolean }} alpha
 * @property {{ isSecurity: boolean }} security
 */
/**
 * @typedef {object} ReleaseLine
 * @property {Record<string, Release>} releases Every release in the line,
 *   newest first, keyed by version, such as `v17.6.0`.
 * @property {Support} [support] Only present when the release schedule has a
 *   start date for the line.
 * @property {Security} security
 */
/**
 * Every release line, newest first, keyed by name, such as `v22` or `v0.10`.
 *
 * @typedef {Record<string, ReleaseLine>} Data
 */
/**
 * Fetches the Node.js release index and release schedule and merges them into
 * one object keyed by release line.
 *
 * @param {Options} [options]
 * @returns {Promise<Data>}
 */
declare function core(options?: Options): Promise<Data>;
