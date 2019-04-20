const express = require("express");
const app = express();
const socket = require("socket.io");

const server = app.listen(3000, () => {
  console.log("listening to requests on port 3000");
});

const io = socket(server);

io.on('connection',(socket)=>{

  socket.emit('getusername',{
    username: socket.id.substring(0, 4)
  })

  console.log('make socket connection',socket.id);
  socket.on("chat", (data) => {
    io.sockets.emit("chat", data);
  });

  socket.on('typing',data=>{
    socket.broadcast.emit("typing", data);
  });
});
