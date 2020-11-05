import express from "express";
import dotenv from "dotenv";
import socket from "socket.io";

dotenv.config();
const PORT = process.env.PORT || 9000;

const app = express();
const io = socket(
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:9000`);
  })
);

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
