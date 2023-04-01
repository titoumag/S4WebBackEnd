const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http,{
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST']
    }
});
const cors = require('cors');
app.use(cors());

clients = {}
chatMessages = []

io.on("connection", (socket) => {
    console.log("New client connected");
    console.log(socket.id);


    clients[socket.id] = {id:socket.id,name:"User-"+socket.id, color:{r:Math.random()*255,g:Math.random()*255,b:Math.random()*255}};
    io.emit("userData",clients[socket.id]);
    io.emit("allMessages", [chatMessages,clients]);
    socket.on("message", (data) => {
        console.log(data);
        chatMessages.push([data[0],data[1]]);
        io.emit("allMessages", [chatMessages,clients]);
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    })

    socket.on("newUserInfos", (data) => {
        clients[data.id] = data;
        io.emit("allMessages", [chatMessages,clients]);
    })
})

http.listen(4242, () => {
    console.log("Listening on port 4242");
})