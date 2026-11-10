export = beforeEachTemplate;
/**
 * Mocks the network for a test: the default and `https://bnb.im` index.json
 * and schedule.json URLs serve the snapshots, and any other request
 * fails.
 */
declare function beforeEachTemplate(): void;
