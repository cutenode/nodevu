# @nodevu/fetchindex

A tool that fetches the /dist/index.json file from the Node.js website.

## Usage

```js
const fetchindex = require('@nodevu/fetchindex')

const options = {
	fetch: globalThis.fetch, // use your own fetch if you want!
	urls: {
		index: 'https://nodejs.org/dist/index.json',
	},
};

const index = await fetchindex(options); // returns a huge JSON object
```

## API
- `fetchindex(options)`
  - `options` (object): Options object.
		- `fetch` (function): Fetch function. Default: `globalThis.fetch`.
		- `urls` (object): URLs object.
			- `index` (string): URL to fetch the index.json file from. Default: `'https://nodejs.org/dist/index.json'`.
	- Returns: Promise that resolves with the fetched `index.json` object.