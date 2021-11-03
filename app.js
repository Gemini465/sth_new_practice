/*
应用的启动模块
1. 通过express启动服务器
2. 通过mongoose连接数据库
  说明: 只有当连接上数据库后才去启动服务器
3. 使用中间件
 */
const http = require('http')
const webSocket = require('websocket').server
const express = require('express')
const app = express() // 产生应用对象
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const {server_port} = require('./config/db.config')
const connectMongo = require('./db/connect')
const userSchema = require('./graphqlSchema/userSchema')
// const schemaGenerator = require('./graphqlSchema/userTypeSchema')

// 跨域
app.use(cors())
// 声明使用静态中间件, 公开文件夹，供用户访问静态资源
app.use(express.static('public'))
// 声明使用解析post请求的中间件
app.use(express.urlencoded({extended: true})) // 请求体参数是: name=tom&pwd=123
app.use(express.json()) // 请求体参数是json结构: {name: tom, pwd: 123}
// 声明使用解析cookie数据的中间件
const cookieParser = require('cookie-parser')
app.use(cookieParser())

const hpServer = http.createServer().listen(8888, () => {
    console.log(8888);
})

const wsServer = new webSocket({
    httpServer: hpServer,
    autoAcceptConnections: false
})

const conns = []
wsServer.on('request', request => {
    const connection = request.accept()
    conns.push(connection)
    connection.on('message', message => {
        console.log(message);
        conns.forEach(item => {
            item.send(message.utf8Data)
        })
    })
})

app.use((req, res, next) => {
    const {cookies, url, body} = req
    console.log(cookies)
    // console.log(body)
    res.cookie('_id', 'fasdfaserwerqw', {maxAge: 1000 * 30, httpOnly: true})
    next()
})

// app.use('/graphqlGenerator', graphqlHTTP({
//     schema: schemaGenerator,
//     graphiql: false
// }))
app.use('/graphql', graphqlHTTP({
    schema: userSchema.UserSchema,
    rootValue: userSchema.UserRoot,
    graphiql: true
}))
app.use('/api', require('./router/user'))
// 优化数据库连接
const startServer = function () {
    app.listen(server_port, () => {
        console.log('服务器启动成功, 监听端口:'+server_port)
    })
}
// 连接成功后启动server
connectMongo(startServer)
