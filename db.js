const PouchDB = require('pouchdb').defaults({prefix: '.data/'});
const pouchDBFind = require('pouchdb-find');

PouchDB.plugin(pouchDBFind);

const db = name => new PouchDB(
  process.browser ? `${location.protocol}//${location.host}/_api/${name}` : name
);

const pages = db('pages');

pages.createIndex({
  index: {
    fields: ['slug']
  }
});

pages.createIndex({
  index: {
    fields: ['lastUpdated']
  }
});

Object.assign(exports, {PouchDB, db, pages});
