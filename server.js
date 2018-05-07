const {createServer} = require('http');
const {parse} = require('url');
const next = require('next');
const express = require('express');
const {PouchDB, users} = require('./db');
const expressPouch = require('express-pouchdb');
const url = require('url');
const bodyparser = require('body-parser');
const session = require('express-session');
const {superlogin, passport} = require('./auth');

require('dotenv/config');

const unpromise = fn => (...args) => {
	const cb = args.pop();
	Promise.resolve().then(() => fn(...args)).then(v => cb(null, v), e => cb(e));
};

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

const redirectToUnderscores = (req, res, next) => {
	if (req.path.includes('%20')) {
		return res.redirect(301, req.path.replace(/%20/g, '_'));
	}

	next();
};

const selectMiddleware = condition => (a, b) => (req, res, next) =>
	(condition(req, res) ? a : b)(req, res, next);

const improvedLogin = [
	(req, res, next) => {
		passport.authenticate('local', (err, user, info) => {
			if (err) {
				return next(err);
			}

			if (!user) {
				// Authentication failed
				return res.status(401).json(info);
			}

			// Success
			req.logIn(user, {}, err => {
				if (err) {
					return next(err);
				}

				return next();
			});
		})(req, res, next);
	},
	(req, res, next) => {
		// Success handler
		return superlogin.createSession(req.user._id, 'local', req).then(
			mySession => {
				req.session.session = mySession; // yo dawg i heard you like sessions
				console.log(req.path, req.sessionID);
				res.status(200).json(mySession);
			},
			err => {
				return next(err);
			}
		);
	},
];

app.prepare().then(() => {
	const server = express();

	server.use(bodyparser.json());
	server.use(
		session({
			rolling: false,
			resave: true,
			saveUninitialized: false,
			secret: 'keyboard cat',
			cookie: {
				maxAge: 3600000,
				httpOnly: false,
			},
		})
	);
	server.use(passport.initialize());
	server.use(passport.session());

	server.use((req, res, next) => {
		console.log(req.path, req.sessionID);
		console.log(req.session);
		next();
	});

	passport.deserializeUser(unpromise(id => users.get(id)));
	passport.serializeUser(unpromise(user => user._id));

	server.post('/_auth/register', (req, res, next) => {
		if (req.body.secret === process.env.REGISTER_SECRET) {
			next();
		} else {
			next(new Error('Wrong secret, nice try'));
		}
	});

	server.post('/_auth/login', improvedLogin);

	server.use('/_api', expressPouch(PouchDB, {logPath: '.data/log.txt'}));
	server.use('/_auth', superlogin.router);
	server.get('/_user/login', (req, res) =>
		app.render(req, res, '/login', req.query)
	);

	server.get('/', (req, res) => app.render(req, res, '/'));
	server.get('/_edit*', redirectToUnderscores, (req, res) =>
		app.render(req, res, '/edit', {slug: req.params[0]})
	);

	server.get(
		'/*',
		selectMiddleware(app.isInternalUrl)(
			(req, res) => handle(req, res, url.parse(req.url)),
			express
				.Router()
				.use(redirectToUnderscores)
				.get((req, res) =>
					app.render(req, res, '/page', {slug: '/' + req.params[0]})
				)
		)
	);

	server.listen(3000, () => console.log('Listening on 3000'));
});
