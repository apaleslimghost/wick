const {createServer} = require('http');
const {parse} = require('url');
const next = require('next');
const express = require('express');
const {PouchDB} = require('./db');
const expressPouch = require('express-pouchdb');
const url = require('url');
const bodyparser = require('body-parser');
const session = require('express-session');
const {superlogin, passport} = require('./auth');

require('dotenv/config');

const unpromise = fn => (...args) => {
	const cb = args.pop();
	fn(...args).then(v => cb(null, v), e => cb(e));
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

app.prepare().then(() => {
	const server = express();

	server.use(bodyparser.json());
	server.use(
		session({
			resave: false,
			saveUninitialized: false,
			secret: 'keyboard cat',
		})
	);
	server.use(passport.initialize());
	server.use(passport.session());

	server.get('/_auth/register', (req, res, next) => {
		if (req.body.secret === process.env.REGISTER_SECRET) {
			next();
		} else {
			next(new Error('Wrong secret, nice try'));
		}
	});

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
