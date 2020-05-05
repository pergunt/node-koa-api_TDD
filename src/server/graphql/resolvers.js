const queries = require('../db/queries/movies');

const resolvers = {
  Query: {
    getMovies: async (_, {id}) => {
      let movie;
      if (id) {
        movie = await queries.getSingleMovie(id);
      } else {
        movie = await queries.getAllMovies();
      }
      return movie;
    }
  }
};
module.exports = resolvers;
