import Router from '@koa/router';
import passport from 'koa-passport';
import fs from 'fs';
import queries from '../db/queries/users';

import helpers from './_helpers';

import nodemailer from 'nodemailer';

import config from 'config';

import juice from "juice";

const router = new Router();

router
  .get('/mail', async ctx => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: config.get('nodemailer').gmail
    });
    const templatePath = ctx.render('email');
    const cssPath = config.get('static') + '/email.css';

    const htmlFile = fs.readFileSync(templatePath, {encoding: 'utf8'});
    const css = fs.readFileSync(cssPath, {encoding: 'utf8'});

    const withStyles = juice.inlineContent(htmlFile, css);
    const mailOptions = {
      from: 'iroskoshnyi@softjourn.com', // sender address
      to: "ivanroskishny@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: withStyles// html body
    };
    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    ctx.body = 'ok';
  })
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
