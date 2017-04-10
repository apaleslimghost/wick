import getPage from '../get-page';
import Link from 'next/link';
import Router from 'next/router';
import Markdown from 'react-markdown';

const MarkdownLink =({href, title, children}) => href[0] === '/' ?
<Link href={{pathname: '/page', query: {slug: href}}} as={href}>
	<a title={title}>{children}</a>
</Link> : <a href={href} title={title}>{children}</a>;

const Page = ({page = {}, slug}) => <article>
	<Link href='/'><a>Home</a></Link>
	<Link preload href={{pathname: '/edit', query: {slug}}} as={`/_edit${slug}`}><a>Edit</a></Link>
	<h1>{page.title}</h1>
	<Markdown source={page.content} renderers={{Link: MarkdownLink}} />
</article>;

Page.getInitialProps = async ({query, res}) => {
	const result = await getPage(query.slug);

	if(result.found) {
		return result;
	}

	if(res) {
		res.redirect(`/_edit${result.slug}`);
		return {};
	} else {
		return Router.replace({pathname: '/edit', query: {slug: result.slug}}, `/_edit${result.slug}`);
	}
};

export default Page;
