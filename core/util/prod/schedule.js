async function schedule (options) {
	// parse our options and set up fetch if a custom fetch is passed
	const fetch = options.fetch;
	const url = options.urls.schedule;

	// fetch the url, get the json from the fetched URL that we're going to use
	const raw = await fetch(url);
	const schedule = await raw.json();
	
	return schedule
}

module.exports = schedule