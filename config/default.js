const defer = require('config/defer').deferConfig;
const path = require('path');

const {
  email: user,
  pass
} = process.env;

module.exports = {
  // secret data can be moved to env variables
  // or a separate config
  port: 3000,
  nodemailer: {
    gmail: {
      user,
      pass,
    }
  },
  knex: {
    dev: {
      connection: 'postgres://localhost:5433/koa_api',
    },
    test: {
      connection: 'postgres://localhost:5433/koa_api_test',
    }
  },
  static: defer(cfg => {
    return path.join(cfg.root, 'src', 'server', 'static');
  }),
  views: {
    // template.root uses config.root
    root: defer(function(cfg) {
      console.log(cfg);
      return path.join(cfg.root, 'src', 'server', 'views');
    })
  },
  root:     process.cwd()
};
