const express = require('express');
const expressGraphQL = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');
const app = express();
const PORT = 3001;

const users = [
    {
        id: 1,
        name: "Hiter",
        age: 28
    },
    {
        id: 2,
        name: "Noorjahan",
        age: 39
    },
    {
        id: 3,
        name: "Toby",
        age: 6
    }
]

const UsersType = new GraphQLObjectType({
    name: 'Users',
    description: 'List of users',
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        users: {
            type: new GraphQLList(UsersType),
            description: 'List of users',
            resolve: () => users
        },
        userById: {
            type: UsersType,
            description: 'Single use by id',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => users.find(user => user.id === args.id)
        }
    })
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addUser: {
            type: UsersType,
            description: 'Add user',
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLNonNull(GraphQLInt)},
            },
            resolve: (parent, args) => {
                const newUser = {id: users.length + 1, name: args.name, age: args.age}
                users.push(newUser)
                return newUser
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));