import session from 'koa-session';
import store from '../session';

exports.init = app => {
  // sessions
  app.keys = ['super-secret-key'];
  app.use(session({store}, app));
};
