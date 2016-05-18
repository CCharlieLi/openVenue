'use strict';

module.exports = (app) => {

  const remotes = app.remotes();
  remotes.after('**', (ctx, output, next) => {
    const status = ctx.method.http.status || ctx.res.statusCode;

    if (status < 400) {
      ctx.res.status(status).json(ctx.result);
    } else {
      ctx.tes.status(status).end();
    }
  });

  remotes.afterError('**', (ctx, next)=> {
    //errLogger(ctx.error, ctx.req, ctx.res, next);
    next();
  });
};
