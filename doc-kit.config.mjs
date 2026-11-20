/**
 * @file The doc-kit config that builds nodevu.dev from the Markdown in docs/pages.
 *
 * @example
 * ```js
 * // `npm run docs` runs `doc-kit generate`, which loads this file by name
 * import config from './doc-kit.config.mjs';
 * ```
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// every package is released together, so core's version is the docs' version
const { version } = JSON.parse(
	readFileSync(join(import.meta.dirname, 'core', 'package.json'), 'utf8'),
);

/**
 * The GitHub repo the site's edit links and repository link point at.
 *
 * @example
 * ```js
 * `https://github.com/${repository}`; // 'https://github.com/cutenode/nodevu'
 * ```
 */
const repository = 'cutenode/nodevu';

/**
 * The published site's base URL, which the sitemap's, llms.txt's and absolute links' URLs start with.
 *
 * @example
 * ```js
 * `${baseURL}/core`; // 'https://nodevu.dev/core'
 * ```
 */
const baseURL = 'https://nodevu.dev';

/**
 * The site's summary for search results and link previews, in its `description` and `og:description` meta tags.
 *
 * @example
 * ```js
 * description.startsWith('nodevu collects'); // true
 * ```
 */
const description =
	'nodevu collects, merges, and reasons about Node.js versions: release lines, LTS and security releases, support phases, and downloadable files.';

/**
 * @import { Configuration, GlobalConfiguration } from '@doc-kit/core/utils/configuration/types'
 */

// doc-kit deep-merges this with its defaults, so `global` can leave out what
// they fill in. its own types only describe the merged result
/**
 * How doc-kit builds the docs site from docs/pages.
 *
 * @public
 * @example
 * ```js
 * import config from './doc-kit.config.mjs';
 *
 * config.global.baseURL; // 'https://nodevu.dev'
 * ```
 *
 * @satisfies {Omit<Partial<Configuration>, 'global'> & { global?: Partial<GlobalConfiguration> }}
 */
export default {
	target: ['html', 'orama-db', 'json', 'llms-txt', 'sitemap'],

	global: {
		project: 'nodevu',
		version,
		repository,
		ref: 'main',
		baseURL,
		input: ['docs/pages/**/*.md'],
		output: 'out',
	},

	html: {
		title: '{project} documentation',

		// 404.html is served at any missing path, and its relative links only
		// resolve from the top level, so /a/b would get a broken sidebar. CI
		// builds what gets published; local builds stay relative so any static
		// server works
		useAbsoluteURLs: process.env.CI === 'true',
		editURL: `https://github.com/${repository}/edit/main/docs/pages{path}.md`,

		// the default copies `static/` into the site, which here is the
		// @nodevu/static workspace. copy the pages' Markdown instead, since
		// llms.txt links to it
		pathsToCopy: [{ [join(import.meta.dirname, 'docs', 'pages')]: '.' }],

		navigation: {
			sidebar: [
				{
					groupName: 'Start',
					items: [{ label: 'nodevu', link: '/index' }],
				},
				{
					groupName: 'Foundational modules',
					items: [
						{ label: '`@nodevu/core`', link: '/core' },
						{ label: '`@nodevu/static`', link: '/static' },
					],
				},
				{
					groupName: 'Utilities',
					items: [
						{ label: '`@nodevu/oldest`', link: '/oldest' },
						{ label: '`@nodevu/newest`', link: '/newest' },
						{ label: '`@nodevu/ranges`', link: '/ranges' },
						{ label: '`@nodevu/aliases`', link: '/aliases' },
						{ label: '`@nodevu/translate`', link: '/translate' },
					],
				},
				{
					groupName: 'Helpers',
					items: [
						{ label: '`@nodevu/parsefiles`', link: '/parsefiles' },
						{ label: '`@nodevu/opt`', link: '/opt' },
						{ label: '`@nodevu/fetchindex`', link: '/fetchindex' },
					],
				},
			],
		},

		head: {
			meta: [
				{ name: 'description', content: description },
				{ property: 'og:description', content: description },
			],
			html: [
				// absolute URLs make the sidebar mark every page as an external
				// link, so only links that leave the site keep the arrow
				`<style>li > a[href^="${baseURL}/"] > div > svg { display: none; }</style>`,
			],
		},
	},
};
