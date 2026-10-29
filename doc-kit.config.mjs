import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// every package is released together, so core's version is the docs' version
const { version } = JSON.parse(
	readFileSync(join(import.meta.dirname, 'core', 'package.json'), 'utf8'),
);

const repository = 'cutenode/nodevu';

const baseURL = 'https://cutenode.github.io/nodevu';

const description =
	'nodevu collects, merges, and reasons about Node.js versions: release lines, LTS and security releases, support phases, and downloadable files.';

/** @type {import('@doc-kit/core/utils/configuration/types').Configuration} */
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

		// all.html and 404.html load their assets from `/` unless URLs are
		// absolute, which breaks under GitHub Pages' /nodevu/. CI builds what
		// gets published; local builds stay relative so any static server works
		useAbsoluteURLs: process.env.CI === 'true',
		editURL: `https://github.com/${repository}/edit/main/docs/pages{path}.md`,

		// the default copies `static/` into the site, which here is the
		// @nodevu/static workspace. copy the pages' Markdown instead, since
		// llms.txt links to it
		pathsToCopy: [{ [join(import.meta.dirname, 'docs', 'pages')]: '.' }],

		imports: {
			'#theme/Navigation': join(
				import.meta.dirname,
				'docs',
				'theme',
				'Navigation.jsx',
			),
		},

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
