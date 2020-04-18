
exports.init = app => app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    ctx.set('X-Content-Type-Options', 'nosniff');

    const preferredType = ctx.accepts('json', 'html');

    if (e.status) {
      ctx.status = e.status;

      // could use template methods to render error page
      if (preferredType === 'json') {
        ctx.body = {
          message: e.message || 'Sorry, an error has occurred.',
          status: 'error'
        };
      } else {
        ctx.body = e.message;
      }

    } else if (e.name === 'error') {
      // knex error
      ctx.status = 400;
      const errors = {};
      if (preferredType == 'json') {
        ctx.body = {
          message: e.message,
          status: 'error'
        };
      } else {
        ctx.body = "Некорректные данные.";
      }

    } else {
      ctx.body = "Error 500";
      ctx.status = 500;
      console.error(e.message, e.stack);
    }
  }
});
