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


    clients[socket.id] = "rgb("+(Math.random()*255)+","+(Math.random()*255)+","+(Math.random()*255)+")";
    io.emit("allMessages", chatMessages);
    socket.on("message", (data) => {
        console.log(data);
        chatMessages.push([data[0],clients[data[1]]]);
        io.emit("allMessages", chatMessages);
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    })
})

http.listen(4242, () => {
    console.log("Listening on port 4242");
})