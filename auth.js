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
			exports.passport.authenticate('bearer', {
				failureRedirect: '/_user/login',
			})(req, res);
			return {};
		} else {
			return fetch('/_auth/session').then(({status}) => {
				if (status === 401) {
					Router.push('/login', '/_user/login');
					return {};
				}
			});
		}
	});
