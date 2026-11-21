/**
 * @file A `beforeEach` hook that serves the snapshot data through undici's mock agent.
 *
 * @example
 * ```js
 * const beforeEachTemplate = require('@nodevu/fixtures/beforeEachTemplate');
 * ```
 */
export = beforeEachTemplate;
/**
 * Mocks the network for a test. The default and `https://bnb.im` index.json
 * and schedule.json URLs serve the snapshots, and any other request fails.
 *
 * @public
 * @example
 * ```js
 * const { beforeEach, it } = require('node:test');
 * const nodevu = require('@nodevu/core');
 * const beforeEachTemplate = require('@nodevu/fixtures/beforeEachTemplate');
 *
 * beforeEach(beforeEachTemplate);
 *
 * it('reads the snapshot', async () => {
 *   const data = await nodevu();
 *
 *   data.v20.releases['v20.2.0'].releaseDate; // '2023-05-16'
 * });
 * ```
 */
declare function beforeEachTemplate(): void;
