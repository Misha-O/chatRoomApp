const path = require("path");
const http = require("http");
const express = require("express");
const socket = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

// app setup
const app = express();
const server = http.createServer(app); //access directly to use socket.io

// set static folder
app.use(express.static(path.join(__dirname, "public")));
const msgBot = "CatsApp bot";

// socket setup
const webSocketServer = socket(server);

// run when connection established
webSocketServer.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //   emits only to current user
    socket.emit("message", formatMessage(msgBot, "Welcome to CatsApp !"));

    //   broadcast when new user connects, all except one who does the action
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(msgBot, `${user.username} has joined the chat`)
      );

    //   send users and room info
    webSocketServer.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    socket.on("typing", (data) => {
      // original socket emits to room users
      socket.broadcast.to(user.room).emit("typing", data);
    });
    //   listen for chat msg
    socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);

      webSocketServer
        .to(user.room)
        .emit("message", formatMessage(user.username, msg));
    });

    //   when user disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
        webSocketServer
          .to(user.room)
          .emit(
            "message",
            formatMessage(msgBot, `${user.username} has left the chat`)
          );

        //   send users and room info
        webSocketServer.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
});

// if no 3000 will look for environment vrbl named port
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
