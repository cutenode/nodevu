const { DateTime } = require('luxon');
const semver = require('semver');
const parsefiles = require('@nodevu/parsefiles');
const optionsParser = require('./util/prod/optionsParser');
const versionFetcher = require('./util/prod/versions');
const scheduleFetcher = require('./util/prod/schedule');

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
async function core(options) {
	// parse our user's options and set up our fetch/DateTime implementations
	const parsedOptions = optionsParser(options);

	const now = DateTime.fromISO(String(parsedOptions.now));

	// collect and configure our data sources
	const versions = await versionFetcher(parsedOptions);
	const schedule = await scheduleFetcher(parsedOptions);

	// instantiate our data object, to be expanded upon
	/** @type {Data} */
	const data = {};

	for (const version of versions.keys()) {
		// keep the pre-release identifiers, otherwise every Alpha release (like
		// `v27.0.0-alpha.0.0.0`) would be coerced into `v27.0.0`
		// every version in index.json parses, so this is never null
		const versionSemver = /** @type {import('semver').SemVer} */ (
			semver.coerce(versions[version].version, {
				includePrerelease: true,
			})
		);

		const name =
			versionSemver.major !== 0
				? `v${versionSemver.major}`
				: `v${versionSemver.major}.${versionSemver.minor}`;

		// define the shape of the object we're going to use
		if (!data[name]) {
			data[name] = /** @type {ReleaseLine} */ ({});
		}

		if (!data[name].releases) {
			data[name].releases = {};
		}

		data[name].releases[`v${versionSemver.version}`] =
			/** @type {Release} */ ({});

		// define semver object
		const semverToReturn = {
			raw: versionSemver.raw,
			major: versionSemver.major,
			minor: versionSemver.minor,
			patch: versionSemver.patch,
			line: name,
		};

		data[name].releases[`v${versionSemver.version}`].semver = semverToReturn;

		data[name].releases[`v${versionSemver.version}`].releaseDate =
			versions[version].date ?? undefined;

		const modules = {
			version: versions[version].modules ?? undefined,
		};

		data[name].releases[`v${versionSemver.version}`].modules = modules;

		// define the dependencies object
		data[name].releases[`v${versionSemver.version}`].dependencies = {};

		data[name].releases[`v${versionSemver.version}`].dependencies.npm =
			versions[version].npm ?? undefined;
		data[name].releases[`v${versionSemver.version}`].dependencies.v8 =
			versions[version].v8 ?? undefined;
		data[name].releases[`v${versionSemver.version}`].dependencies.uv =
			versions[version].uv ?? undefined;
		data[name].releases[`v${versionSemver.version}`].dependencies.zlib =
			versions[version].zlib ?? undefined;
		data[name].releases[`v${versionSemver.version}`].dependencies.openssl =
			versions[version].openssl ?? undefined;

		// surface file information
		data[name].releases[`v${versionSemver.version}`].files =
			/** @type {Release['files']} */ ({});

		// TODO: parse versions[version].files and convert them to URLs that can be directly accessed
		data[name].releases[`v${versionSemver.version}`].files.available =
			versions[version].files ?? [];

		const availableShorthand =
			data[name].releases[`v${versionSemver.version}`].files.available; // since we're going to be writing this a lot for assignments, it's nice to have shorthand for readability

		data[name].releases[`v${versionSemver.version}`].files.links = {};

		const linksShorthand =
			data[name].releases[`v${versionSemver.version}`].files.links; // since we're going to be writing this a lot for assignments, it's nice to have shorthand for readability

		for (const filename of Object.keys(availableShorthand)) {
			const id =
				data[name].releases[`v${versionSemver.version}`].files.available[
					Number(filename)
				];

			const parsedFile = parsefiles(id, versionSemver.version);

			// every identifier in the index has a type so far. one parsefiles
			// doesn't know yet is grouped under 'undefined'
			const type = String(parsedFile.type);

			if (!linksShorthand[type]) {
				linksShorthand[type] = [];
			}

			linksShorthand[type].push({
				id: parsedFile.id,
				files: parsedFile.files,
				architecture: parsedFile.architecture,
			});
		}

		// # LTS
		// ## define the release-line specific support objec`t
		if (schedule[name]?.start !== undefined) {
			// hack-y way to skip this logic on releases that don't have a listed start
			if (!data[name].support) {
				// check to see if we've already written it. if we have, we don't need to waste time on it.
				data[name].support = /** @type {Support} */ ({});
				data[name].support.codename = schedule[name]?.codename ?? undefined;
				data[name].support.lts = schedule[name]?.lts ? {} : undefined;

				// run this the first time we start working on the support object,
				// since that will be the newest version.
				//
				// index.json is the source of truth for LTS status, so create the lts
				// object even if schedule.json doesn't list an lts date for this line
				if (versions[version].lts) {
					data[name].support.lts ??= {};
					data[name].support.lts.newest = versionSemver.version;
				}

				data[name].support.phases = /** @type {Support['phases']} */ ({});
				data[name].support.phases.dates = {};
				data[name].support.phases.dates.alpha =
					schedule[name]?.alpha ?? undefined;
				data[name].support.phases.dates.start =
					schedule[name]?.start ?? undefined;
				data[name].support.phases.dates.lts = schedule[name]?.lts ?? undefined;
				data[name].support.phases.dates.maintenance =
					schedule[name]?.maintenance ?? undefined;
				data[name].support.phases.dates.end = schedule[name]?.end ?? undefined;
			}

			data[name].support.phases.current =
				determineCurrentReleasePhase(now, data[name].support.phases.dates) ??
				{};
		}

		// this is a slightly inefficient way to do this but it's also easy
		//
		// tl;dr we're just assigning this every single iteration and the last
		// iteration will be the oldest version, since we're going from newest
		// to oldest. lines without a support object (no start date in
		// schedule.json) are skipped.
		if (versions[version].lts && data[name].support) {
			data[name].support.lts ??= {};
			data[name].support.lts.oldest = versionSemver.version;
		}

		// ## define the lts object in each specific version
		data[name].releases[`v${versionSemver.version}`].lts =
			/** @type {{ isLts: boolean }} */ ({});

		data[name].releases[`v${versionSemver.version}`].lts.isLts =
			!!versions[version].lts;

		// # Alpha
		// ## define the alpha object in each specific version
		//
		// Alpha releases are the pre-releases a release line gets before its
		// first Current release, versioned as `vN.0.0-alpha.X.Y.Z`
		data[name].releases[`v${versionSemver.version}`].alpha =
			/** @type {{ isAlpha: boolean }} */ ({});

		data[name].releases[`v${versionSemver.version}`].alpha.isAlpha =
			versionSemver.prerelease[0] === 'alpha';

		// # Security
		// ## define the release-line specific security object
		if (!data[name].security) {
			// check to see if we've already written it. if we have, we don't need to waste time on it.
			data[name].security = /** @type {Security} */ ({});
			data[name].security.all = [];
		}

		// the newest security release, which can be populated on the first run
		if (!data[name].security.newest) {
			if (versions[version].security === true) {
				data[name].security.newest = versionSemver.version;
			}
		}

		// same inefficient hack as we do in the LTS 'oldest' logic. ineffecient but gets the job done.
		if (versions[version].security === true) {
			data[name].security.oldest = versionSemver.version;
		}

		// throw the current loop's iteration into the security.all array if it's a security release
		if (versions[version].security === true) {
			data[name].security.all.push(versionSemver.version);
		}

		// ## define the security object in each specfic version
		data[name].releases[`v${versionSemver.version}`].security =
			/** @type {{ isSecurity: boolean }} */ ({});

		data[name].releases[`v${versionSemver.version}`].security.isSecurity =
			versions[version].security ?? false;
	}

	return data;
}

/**
 * @param {import('luxon').DateTime} now
 * @param {PhaseDates} [dates]
 * @returns {Phase | undefined}
 */
function determineCurrentReleasePhase(now, dates = {}) {
	// here we figure out if the dates for each release line passed is in the past or future
	// `true` is in the past
	// `false` is in the future
	// `undefined` is a missing date, which parses as an invalid DateTime
	const isoified = {
		alpha: isInPast(
			DateTime.fromISO(dates.alpha ?? '')
				.diff(now)
				.toMillis(),
		),
		start: isInPast(
			DateTime.fromISO(dates.start ?? '')
				.diff(now)
				.toMillis(),
		),
		lts: isInPast(
			DateTime.fromISO(dates.lts ?? '')
				.diff(now)
				.toMillis(),
		),
		maintenance: isInPast(
			DateTime.fromISO(dates.maintenance ?? '')
				.diff(now)
				.toMillis(),
		),
		end: isInPast(
			DateTime.fromISO(dates.end ?? '')
				.diff(now)
				.toMillis(),
		),
	};

	// set up our result to return
	/** @type {Phase | undefined} */
	let result;

	// iterate over the past/future object and set the above variable to whatever the first date is in the future.
	for (const phase of /** @type {Phase[]} */ (Object.keys(isoified))) {
		// since we're looping, the last true is the current phase
		// since the start (or alpha) date will always be in the past
		if (isoified[phase] === true) {
			result = phase;
		}
	}

	return result;
}

// super hacky tool to convert our weird DateTime tooling into a boolean
// specifically consumes the following:
//
// DateTime.fromISO(DATE).diffNow().toMillis()
//
// where DATE is your date value
/**
 * @param {number} number
 * @returns {boolean | undefined}
 */
function isInPast(number) {
	const sign = Math.sign(number);

	if (sign === -1 || sign === 0) {
		return true;
	}

	if (sign === 1) {
		return false;
	}

	return undefined;
}

module.exports = core;
