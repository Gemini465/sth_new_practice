const graphql = require('graphql')
const UserModel = require('../model/UserModel')

const UserType = new graphql.GraphQLObjectType({
    name: 'User',
    fields: {
        username: {type: graphql.GraphQLString},
        _id: {type: graphql.GraphQLString},
        create_time: {type: graphql.GraphQLInt}
    }
})
const AccountType = new graphql.GraphQLObjectType({
    name: 'Account',
    fields: {
        name: {type: graphql.GraphQLString},
        age: {type: graphql.GraphQLInt},
        sex: {type: graphql.GraphQLString},
        dep: {type: graphql.GraphQLString}
    }
})

const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        account: {
            type: [UserType],
            args: {
                username: {type: graphql.GraphQLString}
            },
            resolve: (_, {username}) => {
                // 操作
                return new Promise((resolve, reject) => {
                    UserModel.find(
                        {username: {'$ne': username}}
                    ).then(users => {
                        resolve(users)
                    }).catch(err => {
                        reject(err)
                    })
                })
            }
        }
    }
})

const mutationType = new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // 方法名
        createAccount: {
            // 返回值类型
            type: AccountType,
            // 参数
            args: {
                username: {type: graphql.GraphQLString},
                password: {type: graphql.GraphQLString}
            },
            // 方法执行函数
            resolve: (_, {username, password}) => {
                return new Promise((resolve, reject) => {
                    // operate database

                })
            }
        }
    }
})

const schema = new graphql.GraphQLSchema({
    query: queryType,
    mutation: mutationType
})

module.exports = schema
