import styled, {css} from 'styled-components';
import {sansScale, serifScale} from './type-scale';
import range from 'lodash.range';
import paramCase from 'param-case';

const header = level => styled(`h${level}`)`
margin: 0;
${serifScale(7 - level)}

padding-left: 1rem;
margin-left: -1rem;

&:hover a {
	opacity: 1;
}`;

const AnchorLink = styled.a`
display: inline-block;
opacity: 0;
font-size: 1rem;
width: 1rem;
margin-left: -1.5rem;
margin-right: .5rem;
position: absolute;
transition: opacity 0.2s;
`;

export default ({level, children, anchor = true, ...props}) => {
	const H = header(level);
	const id = paramCase([].concat(children)[0]);

	return <H {...props} id={anchor ? id : null}>
		{anchor && <AnchorLink href={`#${id}`}>🔗</AnchorLink>}
		{children}
	</H>;
};
