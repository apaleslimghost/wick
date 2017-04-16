import getPage from '../get-page';
import Link from '../components/link';
import MenuLink from '../components/menu-link';
import Router from 'next/router';
import Markdown from 'react-markdown';
import Header from '../components/header';
import Heading from '../components/heading';
import styled from 'styled-components';
import {sansScale} from '../components/type-scale';
import {grey} from '@quarterto/colours';
import {maxWidth} from '../components/grid';

const Page = styled.main``;

const MarkdownLink = ({href, title, children}) => href[0] === '/' ?
<Link href={{pathname: '/page', query: {slug: href}}} as={href} title={title}>
	{children}
</Link> : <a href={href} title={title}>{children}</a>;

const Paragraph = styled.p`${sansScale(0)}`;

const blockquoteFudge = 0.25;

const Blockquote = styled.blockquote`
border-left: 3px ${grey[5]} solid;
margin: 2rem 0 ${1 - blockquoteFudge}rem;
padding: 0 0.75rem ${blockquoteFudge}em;
`;

const List = ({type, children}) => {
	const StyledList = styled(type === 'Ordered' ? 'ol' : 'ul')`
	${sansScale(0)}
	padding: 0;
	margin-left: 1rem;
	`;

	return <StyledList>{children}</StyledList>;
};

const Content = styled.article`
${maxWidth}
`;

const PagePage = ({page = {}, slug}) => <Page>
	<Header>
		<MenuLink prefetch href={{pathname: '/edit', query: {slug}}} as={`/_edit${slug}`}>Edit</MenuLink>
	</Header>
	<Content>
		<Heading level={1}>{page.title}</Heading>
		<Paragraph>
			{page.created && <time dateTime={new Date(page.created).toISOString()}>Created: {new Date(page.created).toLocaleString()}</time>}
			{page.lastUpdated && <time dateTime={new Date(page.lastUpdated).toISOString()}>Last updated: {new Date(page.lastUpdated).toLocaleString()}</time>}
		</Paragraph>
		<Markdown source={page.content} renderers={{
			Link: MarkdownLink,
			Heading,
			Paragraph,
			Blockquote,
			List,
		}} />
	</Content>
</Page>;

PagePage.getInitialProps = async ({query, res}) => {
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

export default PagePage;
