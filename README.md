# nodevu

nodevu is a Node.js Version Utility meant to collect, merge, and reason about Node.js versions in a way that's explicitly developer friendly.

nodevu is composed of a set of modules:

- Foundational Modules
  * [core](./core/): this is the core, online-only module. It calls out to sources that have version information about Node.js and does the heavy lifting of coercion, merging, and reasoning about that data into a format that is easily accessible and (hopefully!) extremely useful. It transparently provides data from the sources it fetches from, but also adds additional useufl context that it figures out based on time, context, and other signals.
  * [static](./static/): this is the offline-only version of nodevu. It's simply an interface to both the full context of [core](./core/), in addition to a few subsets of the data core provides. It is automatically updated when there's new information available, though there aren't gaurantees on when that will be available. This is mostly useful if you're not particularly picky about when your version information is availble.
- Additional Utilities
  * [earliest](./earliest/): this is a utility for finding the earliest LTS or Security release in a Node.js release line.
  * [ranges](./ranges/): a module that provides information about ranges of Node.js versions.
  * [aliases](./aliases/): a module that provides information about aliases for Node.js versions.
- Helper Modules
  * [parsefiles](./parsefiles/): this is a utility for parsing the `files` property of the [Node.js distributions JSON](https://nodejs.org/dist/index.json) file to understand the available files for any given set of identifiers from that list. It also provides additional, potentially useful information.
