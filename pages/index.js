import {pages} from '../db';
import Header from '../components/header';
import MenuLink from '../components/menu-link';
import styled from 'styled-components';
import Teaser from '../components/teaser';
import {maxWidth} from '../components/grid';
import {Heading} from '../components/typography';
import {baseSize} from '../components/type-scale';
import getPage from '../get-page';
import Markdown from 'react-markdown';
import * as typography from '../components/typography';
import {Content} from './page';
import {withBreakpoints, bp} from 'react-element-breakpoints';

const gridBreakpoints = withBreakpoints({
	wide: ({width}) => (width / baseSize) > 30,
});

const PageList = styled.nav`
${maxWidth}

display: flex;
flex-wrap: wrap;
justify-content: space-between;
`;

const TeaserGrid = gridBreakpoints(({breakpoints, title, items}) => <PageList>
	<Heading level={2}>{title}</Heading>
	{items.map(page => <Teaser {...page} key={page._id} columns={bp(1, {wide: 2})({breakpoints})} />)}
</PageList>);

const HomePage = ({recentlyUpdated = [], homePage = {}}) => <div>
	<Header>
		<MenuLink right href={{pathname: '/edit', query: {slug: '/_index'}}} as='/_edit/_index'>Edit</MenuLink>
		<MenuLink success right href={{pathname: '/edit', query: {slug: ''}}} as='/_edit'>New page</MenuLink>
	</Header>

	{homePage.content &&
		<Content><Markdown source={homePage.content} renderers={typography} /></Content>
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
	console.log(await home$);

	return {
		recentlyUpdated: (await recent$).docs,
		homePage: (await home$).page,
	};
};

export default HomePage;
