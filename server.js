const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const url = require("url");
const BodyParser = require("body-parser");
const PORT = process.env.PORT || 4000;
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: "application/*+json" }));

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));

// parse an HTML body into a string
app.use(bodyParser.text({ type: "text/html" }));
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
