const {createServer} = require('http');
const {parse} = require('url');
const next = require('next');
const express = require('express');
const {PouchDB, users, _users} = require('./db');
const expressPouch = require('express-pouchdb');
const Superlogin = require('superlogin');
const passport = require('passport');
const url = require('url');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const redirectToUnderscores = (req, res, next) => {
  if(req.path.includes('%20')) {
    return res.redirect(301, req.path.replace(/%20/g, '_'));
  }

  next();
};

const superlogin = new Superlogin({}, passport, users, _users);
const requireAuth = () => passport.authenticate('bearer', {failureRedirect: '/_user/login'});

const selectMiddleware = condition => (a, b) => (req, res, next) =>
  (condition(req, res) ? a : b)(req, res, next);

app.prepare().then(() => {
  const server = express();

  server.use('/_api', expressPouch(PouchDB, {logPath: '.data/log.txt'}));
  server.use('/_auth', superlogin.router);
  server.get('/_user/login', (req, res) => app.render(req, res, '/login'));

  server.get('/', requireAuth(), (req, res) => app.render(req, res, '/'));
  server.get(
    '/_edit*',
    requireAuth(), redirectToUnderscores,
    (req, res) => app.render(req, res, '/edit', {slug: req.params[0]})
  );

  server.get(
    '/*',
    selectMiddleware(app.isInternalUrl)(
      (req, res) => handle(req, res, url.parse(req.url)),
      express.Router().use(requireAuth(), redirectToUnderscores).get(
        (req, res) => app.render(req, res, '/page', {slug: '/' + req.params[0]})
      )
    )
  );

  server.listen(3000, () => console.log('Listening on 3000'));
});
