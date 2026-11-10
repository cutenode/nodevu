import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../check.mjs', import.meta.url));

/**
 * Runs check.mjs with `input` on stdin, as `harden check --json` would pipe it.
 * @param {string} input
 */
function check(input) {
	return spawnSync(process.execPath, [script], { input, encoding: 'utf8' });
}

/**
 * Builds a `harden check --json` report where only `unapplied` aren't satisfied.
 * @param {string[]} unapplied
 */
function report(unapplied) {
	const checks = ['n_engines', 'n_nogit', 'n_runner'].map((id) => ({
		id,
		satisfied: unapplied.includes(id) ? 0 : 1,
	}));

	return JSON.stringify({ checks });
}

describe('check.mjs', () => {
	it('passes when every opinion is applied', () => {
		const result = check(report([]));

		assert.strictEqual(result.status, 0);
		assert.strictEqual(result.stderr, '');
	});

	it('fails on an opinion that is not applied', () => {
		const result = check(report(['n_nogit']));

		assert.strictEqual(result.status, 1);
		assert.strictEqual(result.stderr, 'harden: n_nogit is not applied\n');
	});

	it('passes when the only unapplied opinion is declined in decisions.json', () => {
		const result = check(report(['n_runner']));

		assert.strictEqual(result.status, 0);
		assert.strictEqual(result.stderr, '');
	});

	it('fails on empty input', () => {
		const result = check('');

		assert.notStrictEqual(result.status, 0);
		assert.match(result.stderr, /SyntaxError/);
	});
});
