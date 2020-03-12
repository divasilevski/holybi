let app = require("express")();
let http = require("http").createServer(app);
let io = require("socket.io")(http);

const serveStatic = require("serve-static");
const path = require("path");

const users = require("./users")();

io.on("connection", socket => {
  // socket.on("USER_JOINED", data => {
  //   // ERRORS
  //   if (users.oneKing(data)) {
  //     socket.emit("ACCESS_DENIED", socket.id);
  //     return;
  //   }
    
  //   if (users.isFull(data.room)) {
  //     socket.emit("ROOM_FULL", socket.id);
  //     return;
  //   }

  //   // CONNECTION
  //   users.add(data, socket.id);
  //   socket.join(data.room);

  //   socket.emit("SET_USER", users.get(socket.id));
  //   io.to(data.room).emit("UPDATE_USERS", users.getByRoom(data.room));
  //   console.log(`socket ${socket.id} connected`);
  // });

  // //
  // socket.on("USER_LEAVE", id => {
  //   const user = users.remove(id);
  //   if (user) io.to(user.room).emit("UPDATE_USERS", users.getByRoom(user.room));
  //   console.log(`socket ${socket.id} disconnected`);
  // });

  // //
  // socket.on("disconnect", () => {
  //   const user = users.remove(socket.id);
  //   if (user) io.to(user.room).emit("UPDATE_USERS", users.getByRoom(user.room));
  //   console.log(`socket ${socket.id} disconnected`);
  // });
  //
  io.emit("connected", `user with token ${socket.id} connected`);
  console.log(`user with token ${socket.id} connected`);

  //
  socket.on("disconnect", () => {
    io.emit("disconnected", `user with token ${socket.id} disconnected`);
    console.log(`user with token ${socket.id} disconnected`);
  });
});

app.use("/", serveStatic(path.join(__dirname, "../dist")));

const port = process.env.PORT || 3000;
http.listen(port, "0.0.0.0", () => {
  console.log(`Server running at port: ${port}`);
});
