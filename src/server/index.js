const fs = require('fs');
const path = require('path');
const Koa = require('koa');

const indexRoutes = require('./routes/index');
const movieRoutes = require('./routes/movies');
const app = new Koa();

const handlers = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();
handlers.forEach(handler => require('./middlewares/' + handler).init(app));

const PORT = process.env.PORT || 1337;

app.use(indexRoutes.routes());
app.use(movieRoutes.routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
