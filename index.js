const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Utilisateur connecté", socket.id);

  socket.on("join_room", (data) => {
    if (data.startsWith("/nick ")) {
      const newUsername = data.split("/nick ")[1];
      socket.username = newUsername;
      console.log("Utilisateur ID", socket.id, "a changé son nom en", newUsername);
    }
    socket.join(data);
    console.log("Utilisateur ID", socket.id, "a rejoins le channel", data)
  })

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_message", data);
  })
  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté", socket.id);
  })
});


server.listen(4000, () => {
  console.log("serveur : port 4000")
})