import {Component} from 'react';
import NextLink from 'next/link';
import styled, {css} from 'styled-components';
import {teal} from '@quarterto/colours';
import textRule, {ruleColor} from './text-rule';

const Anchor = styled.a`
${({theme = {}, simple = false}) => simple
? css`
text-decoration: none;
display: block;
`
: css`
color: ${teal[3]};
${textRule(teal[3], theme.background)}

&:hover {
	color: ${teal[4]};
	${ruleColor(teal[4])}
}

&:active {
	color: ${teal[2]};
	${ruleColor(teal[2])}
}`}
`;

export default class Link extends Component {
	state = {};

	componentDidMount() {
		if(this.link) {
			const {href, as} = this.link;
			this.setState({href, as});
		}
	}

	render() {
		const {children, title, simple, ...props} = this.props;
		return <NextLink {...props} ref={link => this.link = link}>
			<Anchor href={this.state.as || this.state.href} title={title} simple={simple}>{children}</Anchor>
		</NextLink>;
	}
};
