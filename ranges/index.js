const nodevu = require('@nodevu/core');
const aliases = require('@nodevu/aliases');

// building out the model of what we want to see. not totally necessary,
// but helps reduce the amount of logic that's needed to achieve it dynamically.
// also nice to just be able to see it visually represented :)
const defaultRangesObject = {
	all: {
		versions: [],
		newestLts: undefined,
		newestSecurity: undefined,
		newest: undefined,
		oldest: undefined,
	},
	alpha: {
		versions: [],
		newest: undefined,
		oldest: undefined,
	},
	current: {
		versions: [],
		oldestSecurity: undefined,
		newestSecurity: undefined,
		newest: undefined,
		oldest: undefined,
	},
	'lts/latest': {
		versions: [],
		oldestLts: undefined,
		oldestSecurity: undefined,
		newestLts: undefined,
		newestSecurity: undefined,
		newest: undefined,
		oldest: undefined,
	},
	'lts/active': {
		versions: [],
		oldestLts: undefined,
		oldestSecurity: undefined,
		newestLts: undefined,
		newestSecurity: undefined,
		newest: undefined,
		oldest: undefined,
	},
	'lts/maintenance': {
		versions: [],
		oldestLts: undefined,
		oldestSecurity: undefined,
		newestLts: undefined,
		newestSecurity: undefined,
		newest: undefined,
		oldest: undefined,
	},
	eol: {
		versions: [],
		newest: undefined,
		oldest: undefined,
	},
};

/**
 * A range of versions. The fields a range doesn't have, or has nothing to
 * point to, are `undefined`.
 *
 * @typedef {object} Range
 * @property {string[]} versions The versions in the range, newest first.
 * @property {string} [newest]
 * @property {string} [oldest]
 * @property {string} [newestLts]
 * @property {string} [oldestLts]
 * @property {string} [newestSecurity]
 * @property {string} [oldestSecurity]
 */

/**
 * Works out ranges of Node.js versions, named by `@nodevu/aliases`.
 *
 * @param {import('@nodevu/aliases').Alias | readonly import('@nodevu/aliases').Alias[]} [filter]
 *   The ranges to work out. Defaults to `'all'`, every range.
 * @param {import('@nodevu/core').Options} [options] Passed to `@nodevu/core`.
 * @returns {Promise<Partial<Record<import('@nodevu/aliases').Alias, Range>>>}
 *   A key per range. A range with no releases is left out.
 */
async function generateRanges(filter, options) {
	let localFilter = filter;

	// filter is untyped public input, so typeof is how it gets validated here
	// oxlint-disable-next-line anti-slop/no-runtime-typeof
	if (typeof localFilter === 'string') {
		// check to make sure that the filter is valid. if it's not, yeet.
		if (!aliases.includes(localFilter)) {
			throw new Error(
				`Unknown value passed as a filter. The passed value: '${localFilter}'.`,
			);
		}
	} else if (Array.isArray(localFilter) === true) {
		// check to make sure that the filter is valid. if it's not, yeet.
		if (!localFilter.every((alias) => aliases.includes(alias))) {
			throw new Error(
				`At least one of the values passed as a filter is unknown. The passed value(s): '${localFilter.join(
					"', '",
				)}'`,
			);
		}
	} else if (localFilter) {
		throw new Error(
			// names the wrong type in the error, nothing is narrowed
			// oxlint-disable-next-line anti-slop/no-runtime-typeof
			`Unknown value passed as a filter. The passed value: '${localFilter}', with a type of '${typeof localFilter}'. Make sure you are passing a string (or an Array of strings) with valid value(s).`,
		);
	} else {
		localFilter = 'all';
	}

	// a string filter is checked as a one-item list, since `includes` on a
	// string matches substrings
	/** @type {readonly string[]} */
	const requested = [localFilter].flat();

	const wants = (/** @type {string} */ alias) =>
		requested.includes(alias) || requested.includes('all');

	// set up the data from @nodevu/core, passing options (like `fetch` and `now`) through
	const data = await nodevu(options);

	// deep clone the default object so we don't modify it.
	//
	// modifying the default object has some super wonky side effects
	// on subsequent calls to this function that we don't want.
	/** @type {Record<string, Range>} */
	const ranges = JSON.parse(JSON.stringify(defaultRangesObject));

	for (const line in data) {
		const phase = data[line].support?.phases.current;

		for (const key in data[line].releases) {
			const release = data[line].releases[key];

			// Alpha releases (`vN.0.0-alpha.X.Y.Z`) are pre-releases, so they only
			// go into `alpha` and are kept out of every other range
			if (release.alpha?.isAlpha) {
				if (wants('alpha') && phase === 'alpha') {
					ranges.alpha.versions.push(key);
				}

				continue;
			}

			// define `all` data, where the newest LTS and security releases are the
			// first ones seen
			if (wants('all')) {
				ranges.all.versions.push(key);

				if (release.lts.isLts) {
					ranges.all.newestLts ??= key;
				}

				if (release.security.isSecurity) {
					ranges.all.newestSecurity ??= key;
				}
			}

			// the phase `start` means the line is Current
			if (wants('current') && phase === 'start') {
				ranges.current.versions.push(key);

				// only the first Current line fills these in. checking the versions
				// count rather than the fields, since a line without a security
				// release leaves them undefined.
				if (ranges.current.versions.length === 1) {
					ranges.current.oldestSecurity = data[line].security.oldest;
					ranges.current.newestSecurity = data[line].security.newest;
				}
			}

			// lts/active is every release in lts/latest and lts/maintenance
			// TODO: do we want to include all versions in the release line, even prior to it being minted LTS?
			if (release.lts.isLts && (phase === 'lts' || phase === 'maintenance')) {
				const phaseRange = phase === 'lts' ? 'lts/latest' : 'lts/maintenance';

				for (const alias of [phaseRange, 'lts/active']) {
					if (!wants(alias)) {
						continue;
					}

					const range = ranges[alias];
					const isFirstRelease = range.versions.push(key) === 1;

					// the newest bounds come from the range's first line, and the oldest
					// from its last. lts/latest only takes its first line's, same as
					// 'current'.
					if (isFirstRelease) {
						range.newestSecurity = data[line].security.newest;
						range.newestLts = data[line].support?.lts?.newest;
					}

					if (isFirstRelease || alias !== 'lts/latest') {
						range.oldestSecurity = data[line].security.oldest;
						range.oldestLts = data[line].support?.lts?.oldest;
					}
				}
			}

			if (wants('eol') && phase === 'end') {
				ranges.eol.versions.push(key);
			}
		}
	}

	// define newest and oldest from each range's versions, and delete the
	// ranges with none
	for (const alias in ranges) {
		const { versions } = ranges[alias];

		if (versions.length === 0) {
			delete ranges[alias];
			continue;
		}

		ranges[alias].newest = versions[0];
		ranges[alias].oldest = versions.at(-1);
	}

	return ranges;
}

module.exports = generateRanges;
