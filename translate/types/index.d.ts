export = translate;
declare const translations: {
    readonly current: readonly ['current'];
    readonly lts_latest: readonly ['lts/latest'];
    readonly lts: readonly ['lts/active', 'lts/maintenance'];
    readonly supported: readonly ['current', 'lts/active', 'lts/maintenance'];
    readonly all: readonly ['current', 'lts/active', 'lts/maintenance', 'eol'];
};
/**
 * Translates a term of the Node.js package support document to the aliases
 * `@nodevu/ranges` takes.
 *
 * @template {keyof typeof translations} Term
 * @param {Term} legacyName The term, such as `'supported'`.
 * @returns {Promise<(typeof translations)[Term]>}
 */
declare function translate<Term extends keyof typeof translations>(legacyName: Term): Promise<(typeof translations)[Term]>;
