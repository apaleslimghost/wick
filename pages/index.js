import {pages} from '../db';
import Header from '../components/header';
import MenuLink from '../components/menu-link';
import styled from 'styled-components';
import TeaserGrid from '../components/teaser-grid';
import getPage from '../get-page';
import Markdown from 'react-markdown';
import * as typography from '../components/typography';
import {Content} from './page';

const HomePage = ({recentlyUpdated = [], homePage = {}}) => <div>
	<Header>
		<MenuLink right href={{pathname: '/edit', query: {slug: '/_index'}}} as='/_edit/_index'>Edit</MenuLink>
		<MenuLink success right href={{pathname: '/edit', query: {slug: ''}}} as='/_edit'>New page</MenuLink>
	</Header>

	{homePage.content &&
		<Content><Markdown source={homePage.content} renderers={Object.assign({}, typography, {
			Heading: ({level, ...props}) => <typography.Heading {...props} level={Math.min(level + 1, 6)} />
		})} /></Content>
	}

	<TeaserGrid title='Recently Updated' items={recentlyUpdated} />
</div>;

HomePage.getInitialProps = async () => {
	const recent$ = pages.find({
		selector: {$and: [
			{lastUpdated: {$gt: null}},
			{slug: {$ne: '/_index'}},
		]},
		fields: ['_id', 'title', 'content', 'lastUpdated', 'slug'],
		sort: [{lastUpdated: 'desc'}],
		limit: 5,
	});

	const home$ = getPage('/_index');

	return {
		recentlyUpdated: (await recent$).docs,
		homePage: (await home$).page,
	};
};

export default HomePage;
