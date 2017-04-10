import {pages} from '../db';
import Link from 'next/link';
import Header from '../components/header';
import styled from 'styled-components';

const PageList = styled.ul``;

const HomePage = ({pages = []}) => <div>
	<Header />
	<PageList>
		{pages.map(page => <li key={page._id}>
			<Link href={{pathname: 'page', query: {slug: page.slug}}} as={page.slug}>
				<a>{page.title}</a>
			</Link>
		</li>)}
	</PageList>
</div>;

HomePage.getInitialProps = async () => {
	const {rows} = await pages.allDocs({include_docs: true});
	return {
		pages: rows.map(row => row.doc).filter(({_id}) => !_id.startsWith('_design/'))
	};
};

export default HomePage;
