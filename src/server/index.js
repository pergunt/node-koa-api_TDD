const fs = require('fs');
const path = require('path');
const Koa = require('koa');

const indexRoutes = require('./routes/index');
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');

const app = new Koa();
const {ApolloServer} = require('apollo-server-koa');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const {UpperCaseDirective} = require('./graphql/directives');

const handlers = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();
handlers.forEach(handler => require('./middlewares/' + handler).init(app));

app.use(indexRoutes.routes());
app.use(movieRoutes.routes());
app.use(authRoutes.routes());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    upper: UpperCaseDirective
  }
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

