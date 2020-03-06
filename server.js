let app = require("express")();
let http = require("http").createServer(app);
let io = require("socket.io")(http);

const serveStatic = require("serve-static");
const path = require("path");

io.on("connection", socket => {
  //
  io.emit("connected", `user with token ${socket.id} connected`);
  console.log(`user with token ${socket.id} connected`);

  //
  socket.on("disconnect", () => {
    io.emit("disconnected", `user with token ${socket.id} disconnected`);
    console.log(`user with token ${socket.id} disconnected`);
  });
});

app.use("/", serveStatic(path.join(__dirname, "/dist")));

const port = process.env.PORT || 3000;
http.listen(port, "0.0.0.0", () => {
  console.log(`Server running at port: ${port}`);
});
