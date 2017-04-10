import {pages} from '../db';
import Link from 'next/link';

const HomePage = ({pages = []}) => <ul>
	{pages.map(page => <li key={page._id}>
		<Link href={{pathname: 'page', query: {slug: page.slug}}} as={page.slug}>
			<a>{page.title}</a>
		</Link>
	</li>)}
</ul>;

HomePage.getInitialProps = async () => {
	const {rows} = await pages.allDocs({include_docs: true, endkey: '_design'});
	console.log(rows);
	return {
		pages: rows.map(row => row.doc)
	};
};

export default HomePage;
