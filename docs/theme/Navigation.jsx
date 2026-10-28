import SearchBox from '@doc-kit/generator-react/html/ui/components/SearchBox/index.jsx';
import ThemeToggle from '@doc-kit/generator-react/html/ui/components/ThemeToggle.jsx';
import { relativeOrAbsolute } from '@doc-kit/generator-react/html/ui/utils/relativeOrAbsolute.mjs';
import NavBar from '@node-core/ui-components/Containers/NavBar';
import GitHubIcon from '@node-core/ui-components/Icons/Social/GitHub';

import { repository, showSearchBox } from '#theme/config';
import Logo from '#theme/Logo';

import styles from '@node-core/ui-components/Containers/NavBar/index.module.css';

// doc-kit's navigation bar, except the logo links to the site's index
// relative to the page. the NavBar links it to `/`, which leaves the site
// when it's served from a subpath, like GitHub Pages' /nodevu/
export default ({ metadata }) => {
	const home = `${relativeOrAbsolute('/index', metadata.path)}.html`;

	const Link = ({ href, ...props }) => (
		<a href={href === '/' ? home : href} {...props} />
	);

	return (
		<NavBar
			Logo={Logo}
			as={Link}
			sidebarItemTogglerAriaLabel="Toggle navigation menu"
			pathname={metadata.path}
		>
			{showSearchBox && <SearchBox pathname={metadata.path} />}
			<ThemeToggle />
			<a
				href={`https://github.com/${repository}`}
				aria-label={`View ${repository} on GitHub`}
				className={styles.ghIconWrapper}
			>
				<GitHubIcon />
			</a>
		</NavBar>
	);
};
