# @nodevu/optionsparser

A tool that fetches the /dist/index.json file from the Node.js website.

## Usage

```js
const opt = require('@nodevu/opt')

const parsedOptions = await opt(); // returns a default set of options
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
  - `options` (`Object`, optional): Options object.
		- `fetch` (`Function`, optional): Fetch function. Default: `globalThis.fetch`.
		- `urls` (`Object`, optional): URLs object.
			- `index` (`String`, optional): URL to fetch the index.json file from. Default: `'https://nodejs.org/dist/index.json'`.
			- `schedule` (`String`, optional): URL to fetch the schedule.json file from. Default: `'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json'`.
	- Returns: `Object` with a set of default options in the structure required by `@nodevu/core`.