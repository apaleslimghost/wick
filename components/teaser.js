import {withBreakpoints, bp} from 'react-element-breakpoints';
import styled, {ThemeProvider, css} from 'styled-components';
import * as typography from './typography';
import {sansScale, baseSize} from './type-scale';
import {grey, teal} from '@quarterto/colours';
import colour, {setColour} from './colour';
import WickLink from '../components/link';
import Markdown from 'react-markdown';
import textRule from './text-rule';

const teaserBreakpoints = withBreakpoints({
	m: ({width}) => (width / baseSize) > 20,
	l: ({width}) => (width / baseSize) > 40
});

const Teaser = styled.div`
display: ${bp('block', {m: 'flex'})};
overflow: hidden;

${colour('grey', 6)}
border-left: 2px ${teal[3]} solid;
margin-bottom: 1rem;
height: calc(100% - 1rem);

> * {
	margin: 1rem;
}

a:hover & {
	${colour('teal', 6)}
}

a:active & {
	filter: brightness(0.9);
}
`;

const TeaserHeading = styled.div`
flex: 1;
`;

const Excerpt = styled(Markdown)`
flex: 1;
color: ${grey[3]};
max-height: ${bp(6.2, {
	l: 12.2,
	m: 8.2
})}rem;
overflow: hidden;
margin-bottom: 0.8rem;
`;

const Ruled = styled.span`
color: ${grey[3]};
${textRule(grey[3], grey[6])}
`;

const Heading = props => <typography.Heading {...props} anchor={false} level={Math.min(6, props.level + 4)} />;
const Link = ({children}) => <Ruled>{children}</Ruled>;

const SmallParagraph = styled.p`
color: ${grey[3]};
${sansScale(-3)};
`;

export default teaserBreakpoints(({title, content, slug, breakpoints, columns, ...page}) =>
<WickLink simple href={{pathname: 'page', query: {slug}}} as={slug} columns={columns}>
	<Teaser breakpoints={breakpoints}>
		<TeaserHeading>
			<typography.Heading anchor={false} level={bp(5, {
				l: 3,
				m: 4,
			})({breakpoints})}>{title}</typography.Heading>

			<SmallParagraph>
				{page.created && <time dateTime={new Date(page.created).toISOString()}>Created: {new Date(page.created).toLocaleString()}</time>}
			</SmallParagraph>
			<SmallParagraph>
				{page.lastUpdated && <time dateTime={new Date(page.lastUpdated).toISOString()}>Last updated: {new Date(page.lastUpdated).toLocaleString()}</time>}
			</SmallParagraph>
		</TeaserHeading>

		<Excerpt breakpoints={breakpoints} source={content} renderers={Object.assign({}, typography, {
			Heading, Link
		})} />
	</Teaser>
</WickLink>);
