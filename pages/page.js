import getPage from '../get-page';
import Link from '../components/link';
import MenuLink from '../components/menu-link';
import Router from 'next/router';
import Markdown from 'react-markdown';
import * as typography from '../components/typography';
import Header from '../components/header';
import styled from 'styled-components';
import {sansScale} from '../components/type-scale';
import {maxWidth} from '../components/grid';
import TeaserGrid from '../components/teaser-grid';
import RelativeDate from '../components/date';
import {requireAuth} from '../auth';

export const Content = styled.article`
${maxWidth}
`;

const PageLink = ({slug, _id, title}) => <MenuLink
	href={{pathname: '/page', query: {slug}}}
	as={slug} crumb
>{title}</MenuLink>;

export const PagePage = ({page = {}, slug, subpages, parents}) => <main>
	<Header>
		{parents.map(
			parent => <PageLink key={parent._id} {...parent} />
		)}

		<PageLink {...page} />

		<MenuLink right prefetch href={{pathname: '/edit', query: {slug}}} as={`/_edit${slug}`}>Edit</MenuLink>
		<MenuLink right success prefetch href={{pathname: '/edit', query: {slug: slug + '/subpage'}}} as={`/_edit${slug}/subpage`}>Add subpage</MenuLink>
	</Header>
	<Content>
		<typography.Heading level={1}>{page.title}</typography.Heading>
		<Markdown source={page.content} renderers={Object.assign({}, typography, {
			Heading: ({level, ...props}) => <typography.Heading {...props} level={Math.min(level + 1, 6)} />
		})} />

		<typography.HR />

		<typography.Separated>
			{page.created && <span><em>Created</em> <RelativeDate date={new Date(page.created)} /></span>}
			{' ' /* jfc */}
			{page.lastUpdated && <span><em>Last updated</em> <RelativeDate date={new Date(page.lastUpdated)} /></span>}
		</typography.Separated>
	</Content>

	{!!subpages.length && <TeaserGrid title='Subpages' items={subpages} />}
</main>;

PagePage.getInitialProps = async ({query, req, res}) => {
	await requireAuth({req, res});

	const result = await getPage(query.slug, {subpages: true, parents: true});

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
