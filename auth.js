const {default: Router} = require('next/router');
const {PouchDB, users, _users} = require('./db');

if (!process.browser) {
	const passport = require('passport');
	const Superlogin = require('superlogin');
	exports.passport = passport;
	exports.superlogin = new Superlogin({}, passport, users, _users);
}

exports.requireAuth = ({req, res}) =>
	Promise.resolve().then(() => {
		if (req && res) {
			console.log(req.session, req.user);
			if (!req.user) {
				res.redirect('/_user/login');
			}
			return {};
		} else {
			return fetch('/_auth/session', {
				credentials: 'same-origin',
			}).then(({status}) => {
				if (status === 401) {
					Router.push('/login', '/_user/login');
					return {};
				}
			});
		}
	});
