import {pages} from '../db';
import Header from '../components/header';
import MenuLink from '../components/menu-link';
import styled from 'styled-components';
import Teaser from '../components/teaser';
import {maxWidth} from '../components/grid';
import {Heading} from '../components/typography';
import getPage from '../get-page';
import Markdown from 'react-markdown';
import * as typography from '../components/typography';
import {Content} from './page';

const PageList = styled.nav`
${maxWidth}
`;

const HomePage = ({recentlyUpdated = [], homePage = {}}) => <div>
	<Header>
		<MenuLink right href={{pathname: '/edit', query: {slug: '/_index'}}} as='/_edit/_index'>Edit</MenuLink>
		<MenuLink success right href={{pathname: '/edit', query: {slug: ''}}} as='/_edit'>New page</MenuLink>
	</Header>

	{homePage.content &&
		<Content><Markdown source={homePage.content} renderers={typography} /></Content>
	}

	<PageList>
		<Heading level={2}>Recently Updated</Heading>
		{recentlyUpdated.map(page => <Teaser {...page} key={page._id} />)}
	</PageList>
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
	console.log(await home$);

	return {
		recentlyUpdated: (await recent$).docs,
		homePage: (await home$).page,
	};
};

export default HomePage;
