// initialize template system early, to let error handler use them
// koa-views is a wrapper around many template systems!
// most of time it's better to use the chosen template system directly
import config from 'config';
import path from 'path';

exports.init = app => app.use(async (ctx, next) => {
  ctx.render = viewPath => {
    return path.join(config.views.root, viewPath + '.html');
  };
  await next();

});
