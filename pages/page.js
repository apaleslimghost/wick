import getPage from '../get-page';
import Link from '../components/link';
import Router from 'next/router';
import Markdown from 'react-markdown';
import Header from '../components/header';
import Heading from '../components/heading';
import styled from 'styled-components';
import {sansScale} from '../components/type-scale';
import {grey} from '@quarterto/colours';

const Content = styled.article`
${sansScale(0)}
padding-left: 2rem;
padding-right: 2rem;
margin-left: auto;
margin-right: auto;
max-width: 60rem;
`;

const MarkdownLink = ({href, title, children}) => href[0] === '/' ?
<Link href={{pathname: '/page', query: {slug: href}}} as={href} title={title}>
	{children}
</Link> : <a href={href} title={title}>{children}</a>;

const Paragraph = styled.p`${sansScale(0)}`;

const Blockquote = styled.blockquote`
border-left: 3px ${grey[4]} solid;
margin: 2rem 0 0.5rem;
padding: 0 0.75rem 0.5em;
`;

const List = ({type, children}) => {
	const StyledList = styled(type === 'Ordered' ? 'ol' : 'ul')`
	${sansScale(0)}
	padding: 0;
	margin-left: 1rem;
	`;

	return <StyledList>{children}</StyledList>;
};


const Page = ({page = {}, slug}) => <Content>
	<Header>
		<Link href='/'>Home</Link>
		<Link prefetch href={{pathname: '/edit', query: {slug}}} as={`/_edit${slug}`}>Edit</Link>
	</Header>
	<Heading level={1}>{page.title}</Heading>
	{page.created && <time dateTime={new Date(page.created).toISOString()}>Created: {new Date(page.created).toLocaleString()}</time>}
	{page.lastUpdated && <time dateTime={new Date(page.lastUpdated).toISOString()}>Last updated: {new Date(page.lastUpdated).toLocaleString()}</time>}
	<Markdown source={page.content} renderers={{
		Link: MarkdownLink,
		Heading,
		Paragraph,
		Blockquote,
		List,
	}} />
</Content>;

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
