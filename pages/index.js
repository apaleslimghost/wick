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

const HomePage = ({pages = []}) => <div>
	<Header />

	<PageList>
		<Heading level={2}>Recently Updated</Heading>
		{pages.map(page => <Teaser {...page} key={page._id} />)}
	</PageList>
</div>;

HomePage.getInitialProps = async () => {
	const {rows} = await pages.allDocs({include_docs: true});
	return {
		pages: rows.map(row => row.doc).filter(({_id}) => !_id.startsWith('_design/'))
	};
};

export default HomePage;
