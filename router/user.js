const express = require('express')
const router = express.Router()
const UserModel = require('../model/UserModel')
const {route} = require("express/lib/router");

router.post("/user/create", (req, res) => {
    const {username, password} = req.body
    UserModel.findOne({username}).then(user1 => {
        if (!user1) {
            UserModel.create({username, password}).then(user2 => {
                res.send({status: 0, msg: '添加成功'})
            })
        } else {
            res.send({status: 1, msg: '用户名已存在'})
        }
    })
})

router.post("/user/delete", (req, res) => {
    const {_id} = req.body
    UserModel.findOne({_id}).then(user => {
        if (user) {
            UserModel.deleteOne({_id}).then(isdel => {
                res.send({status: 0, msg: '删除成功'})
            }).catch(err => {
                res.send(err)
            })
        } else {
            res.send({status: 1, msg: '用户不存在'})
        }
    }).catch(err => {
        res.send({status: 1, msg: '用户不存在'})
    })
})

router.post("/user/update", (req, res) => {
    const {_id, username, password} = req.body
    UserModel.updateOne({_id}, {$set: {username, password}}).then(isUpdate => {
        if (isUpdate) {
            res.send({status: 0, msg: '修改成功'})
        } else {
            res.send({status: 1, msg: '修改失败'})
        }
    })
})

router.get('/user/list', (req, res) => {
    UserModel.find()
        .then(users => {
            res.send({status: 0, data: {users}})
        })
        .catch(error => {
            res.send({status: 1, msg: '获取用户列表异常, 请重新尝试'})
        })
})

module.exports = router