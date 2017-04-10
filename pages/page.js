import getPage from '../get-page';
import Link from 'next/link';

const Page = ({page = {}, slug}) => <article>
	<Link href={{pathname: '/edit', query: {slug}}} as={`/_edit${slug}`}><a>Edit</a></Link>
	<h1>{page.title}</h1>
	{page.content}
</article>;

Page.getInitialProps = ({query}) => getPage(query.slug);

export default Page;
