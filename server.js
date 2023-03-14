const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const url = require("url");
const BodyParser = require("body-parser");
const PORT = process.env.PORT || 4000;
app.use(BodyParser());
var clientResponseRef;

app.get("/*", (req, res) => {
  var pathname = url.parse(req.url).pathname;
  var object = {
    pathname: pathname,
    method: "get",
    parama: req.query,
  };
  io.emit("page-request", object);
  clientResponseRef = res;
});
app.post("/*", (req, res) => {
  var pathname = url.parse(req.url).pathname;
  var object = {
    pathname: pathname,
    method: "post",
    parama: req.body,
  };
  io.emit("page-request", object);
  clientResponseRef = res;
});

io.on("connection", (Socket) => {
  console.log("Socket connected");
  Socket.on("page-response", (response) => {
    clientResponseRef.send(response);
  });
});

server.listen(PORT, () => {
  console.log("Server is running on port" + PORT);
});
