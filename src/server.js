const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { getCurrentTimeWithMessage, generateLocationMessage } = require('./utils/return_time');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/track_users_file');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 8080;

// here socket for server is successfully configured
const io = socketio(server);

const publicDirectory = path.join(__dirname, '../public');
app.use(express.static(publicDirectory));

let totalConnections = 0;
io.on('connection', (socket) => {
    //console.log(`total connections = ${++totalConnections}`);

    // message coming from the client

    socket.on("join_room", ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });
        if (error) {
            return callback(error);
        }

        socket.join(room);

        socket.emit('message', getCurrentTimeWithMessage('welcome', 'chat admin - swathi'));

        // gets eveyone except sender
        socket.broadcast.to(room).emit("message", getCurrentTimeWithMessage(`${user.username} is joined the room!`, 'chat admin - swathi'));


        io.to(room).emit("all_participants", getUsersInRoom(room), user.room);

        callback();
    })


    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        if (user) {
            // sending message to every single user who connected
            io.to(user.room).emit("message", getCurrentTimeWithMessage(message, user.username));
            //let's check  for others except sender -----  socket.broadcast.emit("message", message);
            callback("Delivered");
        }
    })


    socket.on("share_location", (position, callback) => {
        io.emit("share_location_server", generateLocationMessage(`https://google.com/maps?q=${position.latitude},${position.longitude}`));
        callback();
    })



    // get notified everybody, about present user who left.
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("message", getCurrentTimeWithMessage(`${user.username} has left the room!`, user.username));
            io.to(user.room).emit("all_participants", getUsersInRoom(user.room), user.room);
        }
    })



    // socket.emit('updated_data', totalConnections);

    // socket.on('update_count', () => {
    //     totalConnections++;

    //     io.emit('updated_data', totalConnections);
    // })

    // socket.on('text_data', (data1) => {
    //     string1 += data1;
    //     //  console.log("incoming data = " + string1);
    //     io.emit('updated_string', string1);
    // })

})

server.listen(port, () => {
    console.log(`server is up on port:${port}`);
})
