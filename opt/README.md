# @nodevu/optionsparser

A tool that fetches the /dist/index.json file from the Node.js website.

## Usage

```js
const opt = require('@nodevu/opt')

const parsedOptions = await parser(); // returns a huge JSON object
```

```js
const opt = require('@nodevu/opt')

const options = {
	fetch: globalThis.fetch, // use your own fetch if you want!
	urls: {
		index: 'https://nodejs.org/dist/index.json',
	},
};

const parsedOptions = await parser(options); // returns a huge JSON object
```

## API
- `opt(options)`
  - `options` (object): Options object.
		- `fetch` (function): Fetch function. Default: `globalThis.fetch`.
		- `urls` (object): URLs object.
			- `index` (string): URL to fetch the index.json file from. Default: `'https://nodejs.org/dist/index.json'`.
			- `schedule` (string): URL to fetch the schedule.json file from. Default: `'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json'`.
		- `accept` (array): Array of strings that represent the accepted versions. Default: `['lts', 'current']`.
	- Returns: Promise that resolves with the fetched `index.json` object.