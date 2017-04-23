import {Component} from 'react';
import NextLink from 'next/link';
import styled, {css} from 'styled-components';
import {teal, grey} from '@quarterto/colours';
import textRule, {ruleColor} from './text-rule';
import {sansScale} from './type-scale';
import {transparentize} from 'polished';
import {Heading} from './typography';
import colour, {setColour} from './colour';

const transparentWhite = transparentize(0.8, '#fff');
const transparentBlack = transparentize(0.8, '#000');

export const Anchor = styled.a`
padding: 0 1rem;
line-height: 3rem;
display: inline-flex;
position: relative;
text-decoration: none;

${({theme}) => setColour(theme.background)}
${({primary}) => primary && colour('blue')}
${({danger}) => danger && colour('red')}
${({success}) => success && colour('green', 4)}

&:hover {
	filter: brightness(1.1);
}

&:active {
	filter: brightness(0.9);
}

${({crumb}) => crumb && css`
&::before {
	content: '▸';
	position: absolute;
	top: 0.1rem;
	left: -0.2rem;
	color: ${grey[5]};
}
`}
`;

const Shim = styled.span`
display: block;
flex: 1;
${sansScale(0)}
`;

export const MenuItem = ({logo, children, ...props}) => <Anchor href='#' {...props}>
	{logo ?
		<Heading level={5} anchor={false}>{children}</Heading>
		: <Shim>{children}</Shim>}
</Anchor>;

export default class MenuLink extends Component {
	state = {};

	componentDidMount() {
		if(this.link) {
			const {href, as} = this.link;
			this.setState({href, as});
		}
	}

	render() {
		const {href, as, ...props} = this.props;
		return <NextLink {...{href, as}} ref={link => this.link = link}>
			<MenuItem href={this.state.as || this.state.href} {...props} />
		</NextLink>;
	}
};
