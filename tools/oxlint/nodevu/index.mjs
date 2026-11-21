/**
 * @file nodevu's own oxlint rules, loaded through `jsPlugins` in .oxlintrc.json.
 *
 * @example
 * ```js
 * import plugin from './tools/oxlint/nodevu/index.mjs';
 * ```
 */

import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { definePlugin, defineRule } from '@oxlint/plugins';

/**
 * The package folder `packageDir` found for each path, so each folder's package.json is looked for once.
 *
 * @example
 * ```js
 * // with the repo at /repo
 * packageDir('/repo/ranges/test');
 *
 * packageDirs.get('/repo/ranges/test'); // '/repo/ranges'
 * ```
 *
 * @type {Map<string, string>}
 */
const packageDirs = new Map();

/**
 * The folder of the package `path` is in: the nearest one holding a
 * package.json, which is a workspace or the repo root.
 *
 * @param {string} path An absolute path to a folder.
 * @returns {string} The package's folder, or the filesystem root when no folder above has a package.json.
 * @example
 * ```js
 * // with the repo at /repo
 * packageDir('/repo/ranges/test'); // '/repo/ranges'
 * packageDir('/repo/tools/oxlint'); // '/repo'
 * ```
 */
function packageDir(path) {
	const cached = packageDirs.get(path);

	if (cached !== undefined) {
		return cached;
	}

	const parent = dirname(path);
	const isPackage = existsSync(join(path, 'package.json')) || parent === path;
	const dir = isPackage ? path : packageDir(parent);
	packageDirs.set(path, dir);

	return dir;
}

/**
 * The module path an argument holds, when it's written out in full. Literals
 * that aren't strings come back as strings that are never relative paths.
 *
 * @param {import('@oxlint/plugins').ESTree.Node | null | undefined} node The argument, if there is one.
 * @returns {string | null} The path, or `null` when it's built at runtime.
 * @example
 * ```js
 * // for require('../index') and require(`../${name}`)
 * staticPath(node); // '../index'
 * staticPath(templateNode); // null
 * ```
 */
function staticPath(node) {
	if (node?.type === 'Literal') {
		return String(node.value);
	}

	if (node?.type === 'TemplateLiteral' && node.expressions.length === 0) {
		return node.quasis[0].value.cooked;
	}

	return null;
}

/**
 * Whether a call's `callee` is `require` or `require.resolve`, the calls that take a module path.
 *
 * @param {import('@oxlint/plugins').ESTree.Node} callee The function a call expression calls.
 * @returns {boolean} `true` for `require` and `require.resolve`.
 * @example
 * ```js
 * // for require.resolve('../index') and require.cache
 * isRequire(resolveCall.callee); // true
 * isRequire(cacheCall.callee); // false
 * ```
 */
function isRequire(callee) {
	if (callee.type === 'Identifier') {
		return callee.name === 'require';
	}

	return (
		callee.type === 'MemberExpression' &&
		!callee.computed &&
		callee.object.type === 'Identifier' &&
		callee.object.name === 'require' &&
		callee.property.type === 'Identifier' &&
		callee.property.name === 'resolve'
	);
}

/**
 * Reports relative imports and requires that reach into another package's folder.
 *
 * @example
 * ```js
 * // in ranges/test/test.js
 * require('../index'); // fine, ranges/index.js
 * require('../../core'); // reported: depend on @nodevu/core instead
 * ```
 */
const noCrossPackagePaths = defineRule({
	meta: {
		type: 'problem',
		docs: {
			description:
				"Disallow relative paths into another package's folder, so each package only depends on what it lists.",
		},
		messages: {
			crossPackage:
				"'{{path}}' is in another package's folder. Depend on that package and use its name.",
		},
	},
	create(context) {
		const fromPackage = packageDir(dirname(context.filename));

		/** @param {import('@oxlint/plugins').ESTree.Node | null | undefined} node */
		function check(node) {
			const path = staticPath(node);

			const isRelative = path !== null && /^\.\.?(\/|$)/.test(path);

			if (!isRelative) {
				return;
			}

			const target = resolve(dirname(context.filename), path);

			if (packageDir(target) !== fromPackage) {
				context.report({ node, messageId: 'crossPackage', data: { path } });
			}
		}

		return {
			ImportDeclaration: (node) => check(node.source),
			ExportAllDeclaration: (node) => check(node.source),
			ExportNamedDeclaration: (node) => check(node.source),
			ImportExpression: (node) => check(node.source),
			CallExpression(node) {
				if (isRequire(node.callee)) {
					check(node.arguments[0]);
				}
			},
		};
	},
});

/**
 * nodevu's oxlint plugin, which holds the `no-cross-package-paths` rule.
 *
 * @public
 * @example
 * ```js
 * // .oxlintrc.json
 * // "jsPlugins": [{ "name": "nodevu", "specifier": "./tools/oxlint/nodevu/index.mjs" }],
 * // "rules": { "nodevu/no-cross-package-paths": "error" }
 * import plugin from './tools/oxlint/nodevu/index.mjs';
 *
 * Object.keys(plugin.rules); // ['no-cross-package-paths']
 * ```
 */
export default definePlugin({
	meta: { name: 'nodevu' },
	rules: { 'no-cross-package-paths': noCrossPackagePaths },
});
