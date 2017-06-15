import React, {Component} from 'react';
import debounce from 'lodash.debounce';
import linkState from 'linkstate';
import {Heading} from '../components/typography';
import {sansScale} from '../components/type-scale';
import colour from '../components/colour';
import {Row, container} from '../components/grid';
import {grey, blue, teal, green, red} from '@quarterto/colours';
import styled, {css} from 'styled-components';

const {REGISTER_SECRET: registerSecret} = process.env;

const fork = (...fns) => (...args) => fns.forEach(fn => fn(...args));
const persist = ev => ev.persist();

const emailRegex = /^.+@.+$/; // fuck it, that'll do

const Form = styled.form`
${container('35rem')}
`;

const FieldWrapper = styled.div`
color: ${({valid, invalid}) =>
	valid
		? green[4]
		: invalid
			? red[3]
			: 'inherit'}
`;

const Label = styled.label`
${sansScale(0)}
display: block;
margin-bottom: 0;
`;

const formElementPadding = 0.6;

const formElement = css`
padding: ${formElementPadding}rem;
border-radius: 0.15rem;
border: 0 none;
margin: ${1 - formElementPadding}rem 0 calc(-2px + ${1 - formElementPadding}rem);
`;

const Input = styled.input`
${sansScale(-3)}
${formElement}
width: 100%;
color: inherit;
border: 1px solid;

&:focus {
	color: ${grey[0]};
	border-color: ${teal[2]};
	box-shadow: inset 0 0 10px 2px ${teal[5]};
	outline: none;
}

&::placeholder {
	color: ${grey[5]};
}
`;

const Button = styled.button`
${sansScale(-2)}
${formElement}

cursor: pointer;

${({primary}) => primary && colour('blue')}
${({danger}) => danger && colour('red')}
${({success}) => success && colour('green', 4)}

&:hover {
	filter: brightness(1.1);
}

&:active {
	filter: brightness(0.9);
}
`;

const Buttons = styled.div`
margin-top: 1rem;
`;

const ValidationMessage = styled.div`
${sansScale(-3)}
`;

const indeterminate = {is: i => i === 'indeterminate'};
const valid = {is: i => i === 'valid'};
const invalid = message => ({is: i => i === 'invalid', message});



class Field extends Component {
	state = {
		showValidation: false,
	};

	render() {
		const {
			label,
			form,
			placeholder,
			name = label.toLowerCase(),
			type = 'text',
			onChange = linkState(form, name),
			isValid = () => indeterminate
		} = this.props;
		const validationResult = this.state.showValidation
			? isValid(form.state[name], form.state)
			: indeterminate;

		return <FieldWrapper valid={validationResult.is('valid')} invalid={validationResult.is('invalid')}>
			<Label htmlFor={name}>{label}</Label>

			<Input
				type={type}
				placeholder={placeholder}
				onChange={onChange}
				value={form.state[name]}
				name={name}
				id={name}
				onBlur={() => this.setState({showValidation: true})}
			/>

		{validationResult.is('invalid') &&
			<ValidationMessage>{validationResult.message}</ValidationMessage>}
		</FieldWrapper>;
	}
}

class LoginPage extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
		name: '',
		usernameAvailable: null,
		registering: false, // show login state by default
	};

	static getInitialProps({query}) {
		console.log(query, registerSecret);
		return {
			canRegister: query.secret === registerSecret,
			secret: query.secret
		};
	}

	constructor(...args) {
		super(...args);
		this.checkUsername = debounce(this.checkUsername, 200).bind(this);
	}

	async checkUsername(ev) {
		const {value: username} = ev.target;
		let usernameAvailable;

		if(username.length < 3) {
			usernameAvailable = null;
		} else {
			const response = await fetch(`/_auth/validate-username/${username}`);
			usernameAvailable = (response.status === 200);
		}

		this.setState({
			usernameAvailable,
			registering: this.props.canRegister && usernameAvailable,
		});
	}

	render() {
		return <Form>
			<Heading level={3}>{this.props.canRegister ? 'Sign in or Register' : 'Sign in'}</Heading>

			<Row>
				<Field
					label='Username'
					onChange={fork(persist, this.checkUsername, linkState(this, 'username'))}
					placeholder='person123'
					isValid={(v, {registering, usernameAvailable}) =>
						!v
							? indeterminate
							: registering
								? usernameAvailable
									? valid
									: invalid(`Username ${v} is already taken`)
								: !usernameAvailable
									? valid
									: invalid(`Username ${v} doesn't exist`)}
					form={this} />
			</Row>

			<Row>
				<Field
					label='Password'
					type='password'
					placeholder='Secret'
					isValid={v =>
						!v
							? indeterminate
							: v.length >= 6
								? valid
								: invalid('Should be 6 or more characters')}
					form={this} />
				{this.state.registering &&
					<Field
						label='Confirm password'
						name='confirmPassword'
						type='password'
						placeholder='Secret'
						isValid={(value, {password}) =>
							!value
								? indeterminate
								: value === password
									? valid
									: invalid('Passwords should match')
						}
						form={this} />}
			</Row>

			<Row>
				{this.state.registering &&
					<Field
						label='Email'
						type='email'
						placeholder='person@example.com'
						isValid={v =>
							!v
								? indeterminate
								: !!v.match(emailRegex)
									? valid
									: invalid(`${v} doesn't look like an email address`)}
						form={this} />}

				{this.state.registering &&
					<Field
						label='Name'
						placeholder='Person Lastname'
						isValid={v =>
							!v
								? invalid('Please enter a name')
								: valid}
						form={this} />}
			</Row>

			<Row>
				<Buttons>
					<Button primary={!this.state.registering} success={this.state.registering}>
						{this.state.registering ? 'Register' : 'Sign in'}
					</Button>
				</Buttons>
			</Row>
		</Form>;
	}
}

export default LoginPage;
