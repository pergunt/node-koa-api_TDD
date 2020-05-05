import queries from '../db/queries/movies';
import Date from './scalars';

const resolvers = {
  Date,
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
export default resolvers;
