# anti-slop

Source: [dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop), commit [`e6676e8d0bf17c678cb45b9dacb2bd6ca8dea53a`](https://github.com/dmmulroy/anti-slop/tree/e6676e8d0bf17c678cb45b9dacb2bd6ca8dea53a/skills/install-anti-slop/assets/anti-slop), copied from `skills/install-anti-slop/assets/anti-slop` by that skill's `scripts/install.mjs`. The commit was matched by the installed skill's folder hash (`89044d21c75a367eac1ddbaf208e650b1a7d5820`), which is the git tree of `skills/install-anti-slop` at that commit.

Registered in `.oxlintrc.json` as `anti-slop` from `./tools/oxlint/anti-slop/index.ts`. `vendor/eslint-stylistic/UPSTREAM.md` covers the vendored ESLint Stylistic code.

## local deviations

- `effect/` isn't copied. nodevu doesn't depend on Effect, so the opt-in Effect plugin was never registered.
- `package.json` (`{"type": "module"}`) is new. nodevu is CommonJS, and without it Node warns about reparsing the plugin as ESM on every lint run.
- `rules/require-readable-spacing.ts` lets consecutive top-level `require` declarations sit together, the same way it already treats imports.
