import React, {Component, Children} from 'react';
import WickLink from './link';
import styled, {css} from 'styled-components';
import {sansScale, serifScale, baseSize} from './type-scale';
import range from 'lodash.range';
import paramCase from 'param-case';
import {grey} from '@quarterto/colours';
import {withResize} from 'react-element-breakpoints';

export const header = level => styled(`h${level}`)`
margin: 0;
${serifScale(7 - level)}

padding-left: 1rem;
margin-left: -1rem;

flex-basis: 100%;

&:hover a {
	opacity: 1;
}`;

const headers = range(6).map(level => header(level + 1));

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

export const Heading = ({level, children, anchor = true, ...props}) => {
	const H = headers[level - 1];
	const id = paramCase([].concat(children)[0]);

	return <H {...props} id={anchor ? id : null}>
		{anchor && <AnchorLink href={`#${id}`}>🔗</AnchorLink>}
		{children}
	</H>;
};

export const Link = ({href, title, children}) => href[0] === '/' ?
<WickLink href={{pathname: '/page', query: {slug: href}}} as={href} title={title}>
	{children}
</WickLink> : <a href={href} title={title}>{children}</a>;

export const Paragraph = styled.p`
${sansScale(0)}
overflow: hidden;
`;

export const Separated = styled.p`
${sansScale(-3)}

& > *:after {
	content: ' ${({separator = '∙'}) => separator} ';
}

& > *:last-child:after {
	content: none;
}
`;

export const HR = styled.hr`
${sansScale(0)}

border: 1px solid transparent;
border-top: 1px solid ${grey[5]};
`;

const blockquoteFudge = 0.25;

export const Blockquote = styled.blockquote`
border-left: 3px ${grey[5]} solid;
margin: 2rem 0 ${1 - blockquoteFudge}rem;
padding: 0 0.75rem ${blockquoteFudge}em;
`;

export const List = ({type, children}) => {
	const StyledList = styled(type === 'Ordered' ? 'ol' : 'ul')`
	${sansScale(0)}
	padding: 0;
	margin-left: 1rem;
	`;

	return <StyledList>{children}</StyledList>;
};

const roundImgSize = ({rect}) => {
	const roundedHeight = baseSize * Math.ceil(rect.height / baseSize);
	return (roundedHeight - rect.height) / baseSize;
};

export const Image = withResize(styled.img`
max-width: 100%;
height: auto;
margin: 1rem auto ${roundImgSize}rem;
display: block;
`);
