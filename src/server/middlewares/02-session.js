const session = require('koa-session');
const store = require('../session');

exports.init = app => {
  // sessions
  app.keys = ['super-secret-key'];
  app.use(session({store}, app));
};
