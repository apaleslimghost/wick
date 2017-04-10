const {createServer} = require('http');
const {parse} = require('url');
const next = require('next');
const express = require('express');
const {PouchDB} = require('./db');
const expressPouch = require('express-pouchdb');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const redirectToUnderscores = (req, res, next) => {
  if(req.path.includes('%20')) {
    return res.redirect(301, req.path.replace(/%20/g, '_'));
  }

  next();
};

app.prepare().then(() => {
  const server = express();

  server.use('/_api', expressPouch(PouchDB, {logPath: '.data/log.txt'}));

  server.get('/', (req, res) => res.send('<a href="/_edit/foo">hello</a>'));

  server.get('/_edit*', redirectToUnderscores, (req, res) => app.render(req, res, '/edit', {slug: req.params[0]}));
  server.get('/*', redirectToUnderscores, (req, res) => app.render(req, res, '/page', {slug: '/' + req.params[0]}));

  server.listen(3000, () => console.log('Listening on 3000'));
});
