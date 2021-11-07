const express = require('express')
const multiparty = require('multiparty')
const path = require('path')
const fs = require('fs')
const router = express.Router()
const UserModel = require('../model/UserModel')

const UPLOAD_PATH = path.resolve(__dirname, '../public/uploads')

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

router.post("/file/regularFileUpload", (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.send({status: 1, msg: '文件上传失败'})
        } else {
            const file = files.fileChunk[0]
            const fileName = fields.fileHash[0] + '-' + Date.now()
            const filePath = path.resolve(UPLOAD_PATH, fileName)
            const readStream = fs.createReadStream(file.path)
            const writeStream = fs.createWriteStream(filePath)
            readStream.pipe(writeStream)
            readStream.on('end', () => {
                fs.unlinkSync(file.path)
                res.send({status: 0, msg: '文件上传成功', data: {}})
            })
        }
    })
});

router.post("/file/hugeFileUpload", (req, res) => {
    console.log(req.files);
    res.send("File uploaded successfully");
});

router.post("/file/mergeFile", (req, res) => {
    const {fileHash, fileName} = req.body
    console.log(fileHash, fileName)
    res.send({fileName})
    mergeFile()
})

    
function mergeFile(sourceFiles, targetFile) {
    const scripts = fs.readdirSync(path.resolve(__dirname, sourceFiles))
    const fileWriteStream = fs.createWriteStream(path.resolve(__dirname, targetFile))
    streamMergeRecursive(scripts, fileWriteStream)
}

function streamMergeRecursive(scripts = [], fileWriteStream) {
    if (!scripts.length) {
        return fileWriteStream.end("console.log('stream合并完成')")
    }
    const currentFile = path.resolve(__dirname, 'scripts/', scripts.shift())
    const currentReadStream = fs.createReadStream(currentFile)
    currentReadStream.pipe(fileWriteStream, {end: false})
    currentReadStream.on('end', () => {
        streamMergeRecursive(scripts, fileWriteStream)
    })
    currentFile.on('error', err => {
        console.log(err)
        fileWriteStream.close()
    })
}

module.exports = router