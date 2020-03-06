let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);

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

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const port = process.env.PORT || 80;
http.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
