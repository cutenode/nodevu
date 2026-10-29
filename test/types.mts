// compiled by `npm run types`: each package's published types, used the way
// a TypeScript project would. every @ts-expect-error has to stay an error
import aliases, { type Alias } from '@nodevu/aliases';
import core, { type Data, type Phase } from '@nodevu/core';
import fetchindex, { type IndexRelease } from '@nodevu/fetchindex';
import newest from '@nodevu/newest';
import oldest from '@nodevu/oldest';
import opt from '@nodevu/opt';
import parsefiles, { type ParsedFile } from '@nodevu/parsefiles';
import ranges, { type Range } from '@nodevu/ranges';
import nodevuStatic from '@nodevu/static';
import translate from '@nodevu/translate';

export async function check(): Promise<void> {
	const data: Data = await core({ now: '2025-09-01' });

	const phase: Phase | Record<string, never> | undefined =
		data.v20?.support?.phases.current;

	const major: number | undefined = data.v20?.releases['v20.0.0']?.semver.major;
	// @ts-expect-error now is a date string
	await core({ now: 2025 });

	const lts: string | undefined = await oldest.lts('v16');
	const security: string | undefined = await newest.newest('v16', 'security');
	// @ts-expect-error the type is 'lts' or 'security'
	await oldest.oldest('v16', 'stable');

	const all: Alias[] = aliases;
	const supported = await ranges(await translate('supported'));
	const current: Range | undefined = supported.current;
	// @ts-expect-error not an alias
	await ranges('stable');
	// @ts-expect-error not a package support term
	await translate('stable');

	const file: ParsedFile = parsefiles('linux-x64', '17.6.0');
	const index: IndexRelease[] = await fetchindex(opt());
	const offline: Data = nodevuStatic.default;

	console.log(phase, major, lts, security, all, current, file, index, offline);
}
