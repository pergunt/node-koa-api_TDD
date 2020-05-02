const Router = require('@koa/router');
const passport = require('koa-passport');
const fs = require('fs');
const queries = require('../db/queries/users');
const helpers = require('./_helpers');

const router = new Router();

router
  .get('/auth/register', async ctx => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(ctx.render('register'));
  })
  .post('/auth/register', async (ctx, next) => {
    const user = await queries.addUser(ctx.request.body);
    return passport.authenticate('local', (err, user, info, status) => {
      if (user) {
        ctx.login(user);
        ctx.redirect('/auth/status');
      } else {
        ctx.throw(400, 'Errr');
      }
    })(ctx, next);
  })
  .get('/auth/status', async ctx => {
    if (helpers.ensureAuthenticated(ctx)) {
      ctx.type = 'html';
      ctx.body = fs.createReadStream(ctx.render('status'));
    } else {
      ctx.redirect('/auth/login');
    }
  })
  .get('/auth/login', async ctx => {
    if (!helpers.ensureAuthenticated(ctx)) {
      ctx.type = 'html';
      ctx.body = fs.createReadStream(ctx.render('login'));
    } else {
      ctx.redirect('/auth/status');
    }
  })
  .post('/auth/login', async ctx => {
    return passport.authenticate('local', (err, user, info, status) => {
      if (user) {
        ctx.login(user);
        ctx.redirect('/auth/status');
      } else {
        ctx.throw(400, 'Forbidden');
      }
    })(ctx);
  })
  .get('/auth/logout', async ctx => {
    if (ctx.isAuthenticated(ctx)) {
      ctx.logout();
      ctx.redirect('/auth/login');
    } else {
      // ctx.body = { success: false };
      ctx.throw(401, 'Access allowed only for registered users');
    }
  });

module.exports = router;
