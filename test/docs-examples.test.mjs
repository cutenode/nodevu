// runs the JavaScript examples in docs/pages with readme-assert, which also
// checks each `//=> value` comment against the expression on its line
import assert from 'node:assert';
import { readdirSync } from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { run } from 'readme-assert';

const pages = fileURLToPath(new URL('../docs/pages/', import.meta.url));

const setup = fileURLToPath(new URL('docs-setup.cjs', import.meta.url));

describe('the docs examples', () => {
	for (const page of readdirSync(pages)) {
		if (!page.endsWith('.md')) continue;

		it(`run in ${page}`, async () => {
			const { exitCode, stdout, stderr } = await run(`${pages}${page}`, {
				all: true,
				require: [setup],
			});

			assert.equal(exitCode, 0, `${stdout}\n${stderr}`);
		});
	}
});
