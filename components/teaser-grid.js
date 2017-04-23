import {baseSize} from './type-scale';
import Teaser from './teaser';
import {Heading} from './typography';
import {withBreakpoints, bp} from 'react-element-breakpoints';
import styled from 'styled-components';
import {maxWidth} from './grid';

const gridBreakpoints = withBreakpoints({
	wide: ({width}) => (width / baseSize) > 30,
});

const PageList = styled.nav`
${maxWidth}

display: flex;
flex-wrap: wrap;
justify-content: space-between;
`;

const TeaserGrid = gridBreakpoints(({breakpoints, title, items}) => <PageList>
	<Heading level={2}>{title}</Heading>
	{items.map(page => <Teaser {...page} key={page._id} columns={bp(1, {wide: 2})({breakpoints})} />)}
</PageList>);

export default TeaserGrid;
