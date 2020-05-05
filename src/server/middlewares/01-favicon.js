// Usually served by Nginx
import favicon from 'koa-favicon';

exports.init = app => app.use(favicon());
