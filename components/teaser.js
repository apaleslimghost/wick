import {withBreakpoints, bp} from 'react-element-breakpoints';
import styled, {ThemeProvider} from 'styled-components';
import {Heading, Paragraph} from './typography';
import {baseSize} from './type-scale';
import {grey, teal} from '@quarterto/colours';
import colour, {setColour} from './colour';
import Link from '../components/link';

const teaserBreakpoints = withBreakpoints({
	m: ({width}) => (width / baseSize) > 20,
	l: ({width}) => (width / baseSize) > 40
});

const Teaser = styled.div`
${colour('grey', 6)}
border-left: 2px ${teal[3]} solid;
padding: 1rem;
margin-bottom: 1rem;

a:hover & {
	${colour('teal', 6)}
}

a:active & {
	filter: brightness(0.9);
}
`;

const getExcerpt = content => content.slice(0, 50) + (content.length > 50 ? '…' : '');

export default teaserBreakpoints(({title, content, slug, breakpoints}) =>
<Link simple href={{pathname: 'page', query: {slug}}} as={slug}>
	<Teaser>
		<Heading anchor={false} level={bp(5, {
			l: 3,
			m: 4,
		})({breakpoints})}>{title}</Heading>
		<Paragraph>{getExcerpt(content)}</Paragraph>
	</Teaser>
</Link>);
