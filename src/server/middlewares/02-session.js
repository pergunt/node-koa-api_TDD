const session = require('koa-session');
const RedisStore = require('koa-redis');

exports.init = app => {
  // sessions
  app.keys = ['super-secret-key'];
  app.use(session(app));
  /*
    app.use(session({
    store: new RedisStore()
  }, app));
   */
};
