const {buildSchema} = require('graphql')
const UserModel = require('../model/UserModel')

const UserSchema = buildSchema(`
    type User {
        _id: String
        username: String
        password: String
    }
    
    type Query {
        userList: [User]
    }
`)

const UserRoot = {
    userList() {
        return new Promise((resolve, reject) => {
            UserModel.find().then(users => {
                console.log(users);
                resolve(users)
            }).catch(err => {
                reject(err)
            })
        }).catch(err => {
            console.log(err)
        })
    }
}

module.exports = {
    UserSchema,
    UserRoot
}
