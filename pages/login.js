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
		usernameExists: true, // show login state by default
	};

	constructor(...args) {
		super(...args);
		this.checkUsername = debounce(this.checkUsername, 200).bind(this);
	}

	async checkUsername(ev) {
		const {value: username} = ev.target;
		if(username.length < 3) return;

		const response = await fetch(`/_auth/validate-username/${username}`);
		this.setState({
			usernameExists: response.statusCode === 409
		});
	}

	render() {
		return <form>
			<input
				type="text"
				onChange={fork(persist, this.checkUsername, linkState(this, 'username'))}
				value={this.state.username}
				name='username'
			/>

		{this.state.usernameExists ? 'yup' : 'nope'}
		</form>;
	}
}

export default LoginPage;
