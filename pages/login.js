import React, {Component} from 'react';
import debounce from 'lodash.debounce';
import linkState from 'linkstate';

const {REGISTER_SECRET: registerSecret} = process.env;

const fork = (...fns) => (...args) => fns.forEach(fn => fn(...args));
const persist = ev => ev.persist();

class LoginPage extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
		registering: false, // show login state by default
	};

	constructor(...args) {
		super(...args);
		this.checkUsername = debounce(this.checkUsername, 200).bind(this);
	}

	async checkUsername(ev) {
		const {value: username} = ev.target;
		let registering = false;

		if(username.length < 3) {
			registering = false;
		} else {
			const response = await fetch(`/_auth/validate-username/${username}`);
			registering = (response.status === 200);
		}

		console.log(registering);

		this.setState({ registering });
	}

	render() {
		return <form>
			<input
				type="text"
				onChange={fork(persist, this.checkUsername, linkState(this, 'username'))}
				value={this.state.username}
				name='username'
			/>

			<input
				type="password"
				onChange={linkState(this, 'password')}
				value={this.state.password}
				name='password'
			/>

			{this.state.registering && <input
				type="password"
				onChange={linkState(this, 'confirmPassword')}
				value={this.state.confirmPassword}
				name='confirmPassword'
			/>}

			{this.state.registering && <input
				type="email"
				onChange={linkState(this, 'email')}
				value={this.state.email}
				name='email'
			/>}

			{this.state.registering && <input
				type="text"
				onChange={linkState(this, 'name')}
				value={this.state.name}
				name='name'
			/>}
		</form>;
	}
}

export default LoginPage;
