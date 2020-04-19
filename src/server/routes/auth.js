const Router = require('@koa/router');
const passport = require('koa-passport');
const fs = require('fs');
const queries = require('../db/queries/users');
const path = require('path');

const router = new Router();

const getView = name => path.resolve(__dirname, '..', 'views', name);

router
  .get('/auth/register', async (ctx) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(getView('register.html'));
  })
  .post('/auth/register', async (ctx) => {
    const user = await queries.addUser(ctx.request.body);
    return passport.authenticate('local', (err, user, info, status) => {
      if (user) {
        console.log('---ctx-login--');
        ctx.login(user);
        ctx.redirect('/auth/status');
      } else {
        ctx.throw(400, 'Errr');
      }
    })(ctx);
  })
  .get('/auth/status', async (ctx) => {
    if (ctx.isAuthenticated()) {
      ctx.type = 'html';
      ctx.body = fs.createReadStream(getView('status.html'));
    } else {
      ctx.redirect('/auth/login');
    }
  })
  .get('/auth/login', async (ctx) => {
    if (!ctx.isAuthenticated()) {
      ctx.type = 'html';
      ctx.body = fs.createReadStream(getView('login.html'));
    } else {
      ctx.redirect('/auth/status');
    }
  })
  .post('/auth/login', async (ctx) => {
    return passport.authenticate('local', (err, user, info, status) => {
      if (user) {
        ctx.login(user);
        ctx.redirect('/auth/status');
      } else {
        ctx.throw(400, 'Forbidden');
      }
    })(ctx);
  })
  .get('/auth/logout', async (ctx) => {
    if (ctx.isAuthenticated()) {
      ctx.logout();
      ctx.redirect('/auth/login');
    } else {
      // ctx.body = { success: false };
      ctx.throw(401, 'Access allowed only for registered users');
    }
  });

module.exports = router;
