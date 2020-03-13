let app = require("express")();
let http = require("http").createServer(app);
let io = require("socket.io")(http);

const serveStatic = require("serve-static");
const path = require("path");

const users = require("./users")();

io.on("connection", socket => {
  //
  socket.on("USER_JOINED", room => {
    const user = users.add(socket.id, room);
    const room_users = users.getByRoom(room);
    socket.emit("SET_USER", user);

    socket.join(room);
    io.to(room).emit("UPDATE_USERS", room_users);

    room_users[0].messages
      ? room_users[0].messages.push({
          type: "admin",
          message: `Пользователь ${user.name} присоединился!`
        })
      : (room_users[0].messages = [
          { type: "admin", message: `Да здравствует, король ${user.name}!` }
        ]);

    io.to(room).emit("UPDATE_MESSAGES", room_users[0].messages);
  });

  //
  socket.on("USER_LEAVE", () => {
    const user = users.remove(socket.id);

    if (user) {
      const room_users = users.getByRoom(user.room);
      if (room_users.length) {
        // 1
        if (user.king) {
          room_users[0].king = true;
          room_users[0].messages = user.messages;
          io.to(room_users[0].id).emit("SET_USER", room_users[0]);

          room_users[0].messages.push({
            type: "admin",
            message: `Да здравствует, король ${user.name}!`
          });
        } else {
          room_users[0].messages.push({
            type: "admin",
            message: `Пользователь ${user.name} вышел!`
          });
        }
        // 2
        io.to(user.room).emit("UPDATE_USERS", room_users);
        io.to(room).emit("UPDATE_MESSAGES", room_users[0].messages);
      }
    }
  });

  //
  socket.on("disconnect", () => {
    const user = users.remove(socket.id);

    if (user) {
      const room_users = users.getByRoom(user.room);
      if (room_users.length) {
        // 1
        if (user.king) {
          room_users[0].king = true;
          room_users[0].messages = user.messages;
          io.to(room_users[0].id).emit("SET_USER", room_users[0]);

          room_users[0].messages.push({
            type: "admin",
            message: `Пользователь ${user.name} вышел!`
          });
          room_users[0].messages.push({
            type: "admin",
            message: `Да здравствует, король ${room_users[0].name}!`
          });
        } else {
          room_users[0].messages.push({
            type: "admin",
            message: `Пользователь ${user.name} вышел!`
          });
        }
        // 2
        io.to(user.room).emit("UPDATE_USERS", room_users);
        io.to(user.room).emit("UPDATE_MESSAGES", room_users[0].messages);
      }
    }
  });
});

app.use("/", serveStatic(path.join(__dirname, "../dist")));

const port = process.env.PORT || 3000;
http.listen(port, "0.0.0.0", () => {
  console.log(`Server running at port: ${port}`);
});
