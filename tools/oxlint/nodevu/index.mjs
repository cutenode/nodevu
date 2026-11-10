import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { definePlugin, defineRule } from '@oxlint/plugins';

/** @type {Map<string, string>} */
const packageDirs = new Map();

/**
 * The folder of the package `path` is in: the nearest one holding a
 * package.json, which is a workspace or the repo root.
 * @param {string} path
 * @returns {string}
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
 * @param {import('@oxlint/plugins').ESTree.Node | null | undefined} node
 * @returns {string | null}
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
 * Whether `callee` is `require` or `require.resolve`.
 * @param {import('@oxlint/plugins').ESTree.Node} callee
 * @returns {boolean}
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

/** nodevu's own oxlint rules. */
export default definePlugin({
	meta: { name: 'nodevu' },
	rules: { 'no-cross-package-paths': noCrossPackagePaths },
});
