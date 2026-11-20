/**
 * @file The data `@nodevu/core` returns, and subsets of it, shipped as JSON.
 *
 * @example
 * ```js
 * const { default: data, support } = require('@nodevu/static');
 * ```
 */
/**
 * Everything `@nodevu/core` returns.
 *
 * @public
 * @example
 * ```js
 * const { default: data } = require('@nodevu/static');
 *
 * data.v16.security.newest; // '16.20.2'
 * ```
 */
declare const _default: import("@nodevu/core").Data;
export default _default;
export declare var releases: Record<string, Record<string, import("@nodevu/core").Release>>;
export declare var security: Record<string, import("@nodevu/core").Security>;
export declare var support: Record<string, import("@nodevu/core").Support>;
