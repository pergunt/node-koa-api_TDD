import fs from 'fs';
import path from 'path';
import Koa from 'koa';

import indexRoutes from './routes/index';
import movieRoutes from './routes/movies';
import authRoutes from './routes/auth';

import {ApolloServer} from 'apollo-server-koa';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import {UpperCaseDirective} from './graphql/directives';

const app = new Koa();

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

