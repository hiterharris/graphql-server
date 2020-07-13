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
];

const userAuth = [
    {
        id: 1,
        username: 'user1',
        password: 'pass',
    },
    {
        id: 2,
        username: 'user2',
        password: 'pass2',
    },
    {
        id: 3,
        username: 'user3',
        password: 'pass3',
    }
];

const UsersType = new GraphQLObjectType({
    name: 'Users',
    description: 'List of users',
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
        userAuth: {
            type: UserAuthType
        }
    })
});

const UserAuthType = new GraphQLObjectType({
    name: 'UserAuth',
    description: 'User authentication data',
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        username: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)}
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
        },
        userAuth: {
            type: new GraphQLList(UserAuthType),
            description: 'User authentication data',
            resolve: () => userAuth
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
        },
        addUserAuth: {
            type: UserAuthType,
            description: 'Add user authentication',
            args: {
                username: { type: GraphQLNonNull(GraphQLString)},
                password: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                const newUser = {id: userAuth.length + 1, username: args.username, password: args.password}
                userAuth.push(newUser)
                return newUser
            }
        },
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