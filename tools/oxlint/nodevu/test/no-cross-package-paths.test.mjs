import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { RuleTester } from 'oxlint/plugins-dev';

import plugin from '../index.mjs';

RuleTester.describe = describe;

RuleTester.it = it;

// the rule looks for package.json files on disk, so the test files sit in the
// repo's real folders
const root = fileURLToPath(new URL('../../../../', import.meta.url));

const rangesTest = `${root}ranges/test/example.test.js`;

const translateTest = `${root}translate/test/example.test.mjs`;

const rootTool = `${root}tools/example.mjs`;

const tester = new RuleTester({ languageOptions: { sourceType: 'commonjs' } });

tester.run('no-cross-package-paths', plugin.rules['no-cross-package-paths'], {
	valid: [
		{ code: "require('../index');", filename: rangesTest },
		{ code: "require('./fixtures');", filename: rangesTest },
		{ code: "require.resolve('../index');", filename: rangesTest },
		{ code: "require('@nodevu/fixtures');", filename: rangesTest },
		{ code: "require('node:path');", filename: rangesTest },
		// only paths written out in full can be checked
		{ code: 'require(`../../core/${name}`);', filename: rangesTest },
		{ code: 'require(path);', filename: rangesTest },
		{ code: 'require(5);', filename: rangesTest },
		{ code: "resolve('../../core');", filename: rangesTest },
		{ code: "require.cache('../../core');", filename: rangesTest },
		{
			code: "import ranges from '../index.js';",
			filename: translateTest,
			languageOptions: { sourceType: 'module' },
		},
		{
			code: "import { check } from './harden/check.mjs';",
			filename: rootTool,
			languageOptions: { sourceType: 'module' },
		},
		// outside any package, the search stops at the filesystem root
		{ code: "require('./example');", filename: '/example.js' },
	],
	invalid: [
		{
			code: "require('../../core/util/prod/optionsParser');",
			filename: `${root}fetchindex/test/test.js`,
			errors: [{ messageId: 'crossPackage' }],
		},
		{
			code: "require('../../core');",
			filename: rangesTest,
			errors: [{ messageId: 'crossPackage' }],
		},
		{
			code: "require.resolve('../../ranges/test/fixtures');",
			filename: `${root}translate/test/examples.test.js`,
			errors: [{ messageId: 'crossPackage' }],
		},
		{
			code: 'require(`../../core/index.js`);',
			filename: rangesTest,
			errors: [{ messageId: 'crossPackage' }],
		},
		{
			code: "import ranges from '../../ranges/index.js';",
			filename: translateTest,
			languageOptions: { sourceType: 'module' },
			errors: [{ messageId: 'crossPackage' }],
		},
		{
			code: "export * from '../../ranges/index.js';",
			filename: translateTest,
			languageOptions: { sourceType: 'module' },
			errors: [{ messageId: 'crossPackage' }],
		},
		{
			code: "export { at } from '../../ranges/test/fixtures.js';",
			filename: translateTest,
			languageOptions: { sourceType: 'module' },
			errors: [{ messageId: 'crossPackage' }],
		},
		{
			code: "await import('../../ranges/index.js');",
			filename: translateTest,
			languageOptions: { sourceType: 'module' },
			errors: [{ messageId: 'crossPackage' }],
		},
		// the repo root is a package of its own
		{
			code: "import core from '../core/index.js';",
			filename: rootTool,
			languageOptions: { sourceType: 'module' },
			errors: [{ messageId: 'crossPackage' }],
		},
	],
});
