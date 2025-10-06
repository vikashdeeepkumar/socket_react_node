const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    'http://localhost:5173',
    'http://192.168.1.70:5173'
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
    //room joining
    socket.on('join_room', (roomName) => {
    socket.join(roomName);
        console.log(`User ${socket.id} joined room: ${roomName}`);
        socket.emit('room_joined_confirmation', roomName);

     });

    socket.on('send_room_message', (data) => {
    const { room, message } = data;
    io.to(room).emit('receive_message', {
      text: message,
      room: room,
      senderId: socket.id,
    });
  });

//   socket.on('send_message', (data) => {
//     io.emit('receive_message', data);
//   });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(5178, () => {
  console.log('Server is running on port 5178');
});
