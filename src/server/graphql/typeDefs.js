const {gql} = require('apollo-server-koa');

const schema = gql`
    directive @upper(
        capitalize: Boolean = true
    ) on FIELD_DEFINITION
    
    type Movie {
        "Unique"
        id: Int
        "Unique"
        name: String @upper
        genre: String
        rating: Int
        explicit: Boolean
    }
    type Query {
        getMovies(id: Int): [Movie]
    }
`;
module.exports = schema;
