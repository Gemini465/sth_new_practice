const mongoose = require('mongoose');
const config = require('../config/db.config');

let isConnectedBefore = false;
const options = {
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    autoReconnect: true,
    useNewUrlParser: true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}

const connect = function (callback) {
    mongoose
        .connect(config.dataBase, function (error) {
            if(!error){
                callback()
            }
        });
};
// connect();

mongoose
    .connection
    .on('error', function () {
        console.log('Could not connect to MongoDB','请确保启动MongoDB服务');
    });

mongoose
    .connection
    .on('disconnected', function () {
        console.log('Lost MongoDB connection...');
        if (!isConnectedBefore)
            connect();
    });
mongoose
    .connection
    .on('connected', function () {
        isConnectedBefore = true;
        console.log('Connection established to MongoDB');
    });

mongoose
    .connection
    .on('reconnected', function () {
        console.log('Reconnected to MongoDB');
    });

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', function () {
    mongoose
        .connection
        .close(function () {
            console.log('Force to close the MongoDB conection');
            process.exit(0);
        });
});

module.exports = connect;