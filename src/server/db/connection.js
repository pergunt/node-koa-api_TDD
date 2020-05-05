import config from '../../../knexfile.js';

const environment = process.env.NODE_ENV || 'development';
module.exports = require('knex')(config[environment]);
