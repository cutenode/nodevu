// package.json's `workspaces` is the list of modules. Configs that can't read
// it name the modules again, so check each copy still matches it
import assert from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

import { parse } from 'yaml';

import docKit from '../doc-kit.config.mjs';

/**
 * Reads a file relative to the repository root.
 * @param {string} path
 */
function read(path) {
	return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
}

/**
 * The parts of a package.json this test reads.
 * @typedef {object} Manifest
 * @property {string[]} [workspaces]
 * @property {{ url: string }} [repository]
 * @property {boolean} [private]
 * @property {Record<string, string>} [scripts]
 * @property {Record<string, string>} [dependencies]
 * @property {Record<string, string>} [devDependencies]
 */

/**
 * @param {string} dir
 * @returns {Manifest}
 */
function manifest(dir) {
	return JSON.parse(read(`${dir}/package.json`));
}

const root = manifest('.');

const workspaces = [...(root.workspaces ?? [])].sort();

/**
 * Maps each module's npm name to its folder.
 * @type {Map<string, string>}
 */
const folders = new Map(
	workspaces.map((ws) => [JSON.parse(read(`${ws}/package.json`)).name, ws]),
);

/**
 * The folders of the modules `ws` loads, and of the ones they load, and so on.
 * @param {string} ws
 * @returns {Set<string>}
 */
function dependsOn(ws) {
	const { dependencies = {}, devDependencies = {} } = manifest(ws);
	const found = new Set();

	for (const name of Object.keys({ ...dependencies, ...devDependencies })) {
		const folder = folders.get(name);

		if (folder === undefined) continue;

		found.add(folder);

		for (const deeper of dependsOn(folder)) found.add(deeper);
	}

	return found;
}

/**
 * Each module release.yml hands uppt, with `!` on the ones it doesn't publish.
 * @returns {string[][]}
 */
function releaseLists() {
	/** @type {{ jobs: Record<string, { steps?: { with?: { packages?: string } }[] }> }} */
	const release = parse(read('.github/workflows/release.yml'));

	return Object.values(release.jobs)
		.flatMap((job) => job.steps ?? [])
		.flatMap((step) => (step.with?.packages ? [step.with.packages] : []))
		.map((packages) => packages.trim().split('\n'));
}

describe('the workspace list', () => {
	it('matches the TypeScript project references', () => {
		/** @type {{ references: { path: string }[] }} */
		// JSON with the line comments taken out
		const tsconfig = JSON.parse(
			read('tsconfig.json').replace(/^\s*\/\/.*$/gm, ''),
		);

		assert.deepStrictEqual(
			tsconfig.references.map(({ path }) => path).sort(),
			workspaces,
		);
	});

	it("matches dependabot's npm directories", () => {
		/** @type {{ updates: { 'package-ecosystem': string, directories?: string[] }[] }} */
		const dependabot = parse(read('.github/dependabot.yml'));

		const npm = dependabot.updates.find(
			(update) => update['package-ecosystem'] === 'npm',
		);

		assert.deepStrictEqual(npm?.directories, [
			'/',
			...workspaces.map((ws) => `/${ws}`),
		]);
	});

	it("matches every package list in release.yml, and they're the same", () => {
		for (const packages of releaseLists()) {
			assert.deepStrictEqual(
				packages.map((name) => name.replace(/^!/, '')).sort(),
				workspaces,
			);
		}

		assert.equal(new Set(releaseLists().map(String)).size, 1);
	});

	// private modules, like the tests' fixtures, aren't for users
	it('has a docs page and a sidebar link for each public module', () => {
		const documented = workspaces.filter((ws) => !manifest(ws).private);

		const links = docKit.html.navigation.sidebar
			.flatMap(({ items }) => items)
			.map(({ link }) => link.slice(1))
			.filter((link) => link !== 'index')
			.sort();

		assert.deepStrictEqual(links, documented);

		for (const ws of documented) {
			assert.ok(
				existsSync(new URL(`../docs/pages/${ws}.md`, import.meta.url)),
				ws,
			);
		}
	});

	it('has a license in each module', () => {
		for (const ws of workspaces) {
			assert.ok(existsSync(new URL(`../${ws}/LICENSE`, import.meta.url)), ws);
		}
	});

	// npm rejects a provenance publish when repository.url doesn't match the
	// repo the release workflow runs in
	it('names this repository in every published module', () => {
		const [published = []] = releaseLists();

		for (const ws of published.filter((name) => !name.startsWith('!'))) {
			assert.equal(manifest(ws).repository?.url, root.repository?.url, ws);
		}
	});

	// CI only tests a module when its files or a module it loads changed
	it('has a CI path filter for each tested module, covering what it loads', () => {
		/** @type {{ jobs: { changes: { steps: { id?: string, with?: { filters: string } }[] } } }} */
		const ci = parse(read('.github/workflows/ci.yml'));
		const step = ci.jobs.changes.steps.find(({ id }) => id === 'filter');

		/** @type {Record<string, string[]>} */
		const filters = parse(step?.with?.filters ?? '');

		for (const ws of workspaces) {
			if (!manifest(ws).scripts?.coverage) continue;

			const expected = [ws, ...dependsOn(ws)].map((folder) => `${folder}/**`);
			const paths = filters[ws] ?? [];

			for (const path of expected)
				assert.ok(paths.includes(path), `${ws}: ${path}`);
		}
	});
});
