const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const db = require('./dbConnection');

module.exports = session({
  store: new pgSession({
    pool: db,
  }),
  secret: '8eZC8XBCj7o92F81sb0Zb8ob0GXW0ZFS',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias em milisegundos
  },
});
