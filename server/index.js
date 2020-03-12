let app = require("express")();
let http = require("http").createServer(app);
let io = require("socket.io")(http);

const serveStatic = require("serve-static");
const path = require("path");

const users = require("./users")();

io.on("connection", socket => {
  //
  socket.on("USER_JOINED", room => {
    users.add(socket.id, room);
    socket.emit("SET_USER", users.get(socket.id));

    socket.join(room);
    io.to(room).emit("UPDATE_USERS", users.getByRoom(room));
  });

  //
  socket.on("USER_LEAVE", ({ id, room }) => {
    const user = users.remove(id);
    if (user) io.to(user.room).emit("UPDATE_USERS", users.getByRoom(user.room));
  });

  //
  socket.on("disconnect", () => {
    const user = users.remove(socket.id);
    if (user) io.to(user.room).emit("UPDATE_USERS", users.getByRoom(user.room));
  });
});

app.use("/", serveStatic(path.join(__dirname, "../dist")));

const port = process.env.PORT || 3000;
http.listen(port, "0.0.0.0", () => {
  console.log(`Server running at port: ${port}`);
});
