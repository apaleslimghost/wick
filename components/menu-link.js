import {Component} from 'react';
import NextLink from 'next/link';
import styled from 'styled-components';
import {teal, grey} from '@quarterto/colours';
import textRule, {ruleColor} from './text-rule';
import {sansScale} from './type-scale';
import {transparentize} from 'polished';
import Heading from './heading';

const Anchor = styled.a`
padding: 0 1rem;
line-height: 3rem;
display: inline-block;
text-decoration: none;
color: ${grey[0]};

&:hover {
	background: ${transparentize(0.9, teal[4])};
}

&:active {
	background: ${transparentize(0.6, teal[4])};
}
`;

const Shim = styled.span`
display: block;
${sansScale(0)}
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
		const {primary, children, title, ...props} = this.props;
		return <NextLink {...props} ref={link => this.link = link}>
			<Anchor href={this.state.as || this.state.href} title={title}>
				{primary ?
					<Heading level={6} anchor={false}>{children}</Heading>
					: <Shim>{children}</Shim>}
			</Anchor>
		</NextLink>;
	}
};
