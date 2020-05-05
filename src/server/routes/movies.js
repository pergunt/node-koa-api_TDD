import Router from '@koa/router';
import queries from '../db/queries/movies';

const router = new Router();
const BASE_URL = `/api/v1/movies`;

router.get(BASE_URL, async ctx => {
  const movies = await queries.getAllMovies();
  ctx.body = {
    status: 'success',
    data: movies
  };
})
  .get(`${BASE_URL}/:id`, async ctx => {
    const movie = await queries.getSingleMovie(ctx.params.id);
    if (movie.length) {
      ctx.body = {
        status: 'success',
        data: movie
      };
    } else {
      ctx.status = 404;
      ctx.throw(404, 'That movie does not exist.');
    }
  })
  .post(BASE_URL, async ctx => {
    const movie = await queries.addMovie(ctx.request.body);
    if (movie.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: movie
      };
    } else {
      ctx.throw(400, 'Something went wrong.');
    }
  })
  .put(`${BASE_URL}/:id`, async (ctx) => {
    const movie = await queries.updateMovie(ctx.params.id, ctx.request.body);
    if (movie.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: movie
      };
    } else {
      ctx.throw(404, 'That movie does not exist.');
    }
  })
  .delete(`${BASE_URL}/:id`, async (ctx) => {
    const movie = await queries.deleteMovie(ctx.params.id);
    if (movie.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: movie
      };
    } else {
      ctx.throw(404, 'That movie does not exist.');
    }
  });
module.exports = router;
