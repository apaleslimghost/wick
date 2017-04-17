import {pages} from '../db';
import Header from '../components/header';
import MenuLink from '../components/menu-link';
import styled from 'styled-components';
import Teaser from '../components/teaser';
import {maxWidth} from '../components/grid';
import {Heading} from '../components/typography';

const PageList = styled.nav`
${maxWidth}
`;

const HomePage = ({recentlyUpdated = []}) => <div>
	<Header />

	<PageList>
		<Heading level={2}>Recently Updated</Heading>
		{recentlyUpdated.map(page => <Teaser {...page} key={page._id} />)}
	</PageList>
</div>;

HomePage.getInitialProps = async () => {
	const {docs: recentlyUpdated} = await pages.find({
		selector: {lastUpdated: {$gt: null}},
		fields: ['_id', 'title', 'content', 'lastUpdated', 'slug'],
		sort: [{lastUpdated: 'desc'}],
		limit: 5,
	});

	return {
		recentlyUpdated
	};
};

export default HomePage;
