
// Parse application/json, application/x-www-form-urlencoded
// NOT form/multipart!
import bodyParser from 'koa-bodyparser';

exports.init = app => app.use(bodyParser({
  jsonLimit: '56kb'
}));
