const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLSchema,
} = graphql;

//Dummy data
let users = [
    { id: '1', name: 'John', email: 'j@email.com', password: '123', city: 'London' },
    { id: '2', name: 'Jane', email: 'jane@email.com', password: '123', city: 'Sourbone' },
    { id: '3', name: 'Jack', email: 'jack@email.com', password: '123', city: 'Titanic' },
];
 
//Create types

//UserType
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Normal customer for the app, after register password, email and password for login, city for future geolocation distances implementation and name for identification.',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        city: { type: GraphQLString },
    })
});

//LodgeType
const LodgeType = new GraphQLObjectType({
    name: 'Lodge',
    description: "It fetches the lodge location(city and country), if the host is or not SuperHost, the type of lodge(apartment, private room, etc..) maxNumber of guests, the title for advertisement, it's avaliability and their rooms.",
    fields: () => ({
        id: { type: GraphQLString },
        title: { type: GraphQLString },
        typeOfInn: { type: GraphQLString },
        rooms: {
            beds: { type: GraphQLInt },
            rooms: { type: GraphQLInt },
            bathRooms: { type: GraphQLInt },
        },
        maxGuests: { type: GraphQLInt },
        city: { type: GraphQLString },
        country: { type: GraphQLString },
        rating: { type: GraphQLInt },
        avaliability: { type: GraphQLBoolean },
        superHost: { type: GraphQLBoolean },
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: "Query user's data from the UserType interface.",
    fields: {
        user: {
            type: UserType,
            args: {
                id: { type: GraphQLString },
            },

            resolve(parent, args) {
                return users.find(user => user.id === args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})