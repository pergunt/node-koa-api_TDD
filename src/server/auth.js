import passport from 'koa-passport';
import knex from './db/connection';
import {Strategy as LocalStrategy} from 'passport-local';
import bcrypt from 'bcrypt';

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  return knex('users')
    .where({id})
    .first()
    .then(user => {
      done(null, user);
    })
    .catch(err => done(err, null));
});

const options = {

};
/**
 Does the username exist?
 No? then false is returned
 Yes? Does the password match?
 No? false is returned
 Yes? The user object is returned and then the id is serialized to the session
 * @type {{}}
 */
passport.use(new LocalStrategy(options, (username, password, done) => {
  knex('users')
    .where({ username })
    .first()
    .then(user => {
      if (!user) return done(null, false);
      if (!comparePass(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
    .catch(err => done(err));
}));
module.exports = passport;
