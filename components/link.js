import {Component} from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {blue} from '@quarterto/colours';
import textRule, {ruleColor} from './text-rule';

const Anchor = styled.a`
color: ${blue[3]};
${({theme = {}}) => textRule(blue[3], theme.background)}

&:hover {
	color: ${blue[4]};
	${ruleColor(blue[4])}
}

&:active {
	color: ${blue[2]};
	${ruleColor(blue[2])}
}
`;

export default class FancyLink extends Component {
	state = {};

	componentDidMount() {
		if(this.link) {
			const {href, as} = this.link;
			this.setState({href, as});
		}
	}

	render() {
		const {children, title, ...props} = this.props;
		return <Link {...props} ref={link => this.link = link}>
			<Anchor href={this.state.as || this.state.href} title={title}>{children}</Anchor>
		</Link>;
	}
};
