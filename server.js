import express from "express";
import http from "http";
import socket from "socket.io";
const app = express();
const server = http.createServer(app);
const io = socket(server);

// Routes
import routes from "./routes/routes";
app.use(routes);

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on("disconnect", () => console.log(`Disconnected: ${socket.id}`));

  socket.on("join", (room) => {
    console.log(`Socket ${socket.id} joining ${room}`);
    socket.join(room);
  });

  socket.on("chat", ({ room, name, message }) => {
    // Send to all the client in the room
    socket.broadcast.emit("new-message", { room, name, message });
    // Sender to the sender
    socket.emit("new-message", { room, name, message });
  });
});

server.listen(9000, () => {
  console.log(`Server is running at http://localhost:9000`);
});
