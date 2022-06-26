import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import router from './routes/router';
import {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} from './services/usersService';

const PORT = process.env.PORT || 8080;

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(router);

io.on('connection', (socket) => {
  // User joins the room
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);
    if (user === undefined) return callback('Error entering the room.');

    // Join current user to the room
    socket.join(user.room);

    socket.emit('message', {
      user: 'Admin',
      text: `Welcome to the room, ${user.name}!`,
    });

    socket.broadcast.to(user.room).emit('message', {
      user: 'Admin',
      text: `${user.name} has joined the chat!`,
    });

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  // User sends a message
  socket.on('sendMessage', (message: string, callback) => {
    const user = getUser(socket.id);

    if (user === undefined) return;

    io.to(user.room).emit('message', { user: user.name, text: message });
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  // User disconnects
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'Admin',
        text: `${user.name} has disconnected.`,
      });

      io.to(user.room).emit('roomData', {
        users: getUsersInRoom(user.room),
      });
    }
  });
});

httpServer.listen(PORT);
