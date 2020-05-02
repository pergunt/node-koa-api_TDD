const path = require('path');
const config = require('config');

const BASE_PATH = path.join(__dirname, 'src', 'server', 'db');
const {
  dev,
  test
} = config.get('knex');

module.exports = {
  test: {
    client: 'pg',
    connection: test.connection,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  },
  development: {
    client: 'pg',
    connection: dev.connection,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
};
