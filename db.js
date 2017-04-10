const PouchDB = require('pouchdb');
const pouchDBFind = require('pouchdb-find');

PouchDB.plugin(pouchDBFind).defaults({prefix: '.data/'});

const db = name => new PouchDB(
  process.browser ? `${location.protocol}//${location.host}/_api/${name}` : name
);

const pages = db('pages');

pages.createIndex({
  index: {
    fields: ['slug']
  }
});

Object.assign(exports, {PouchDB, db, pages});
