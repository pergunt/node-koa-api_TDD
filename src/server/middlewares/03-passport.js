import passport from '../auth';

exports.init = app => {
  app.use(passport.initialize());
  app.use(passport.session());
};
