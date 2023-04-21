const express = require("express");
const app = express();
const path = require('path');
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
var bodyParser = require('body-parser');

const server = http.createServer(app);

require("dotenv").config();
require("./src/db/conn");

const port = process.env.port;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(__dirname + '/src/public'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


// Routers //
const userRouter = require('./src/routes/user.route');
const blogRouter = require("./src/routes/blog.route");
const contactRouter = require("./src/routes/contact.route");
const commentRouter = require("./src/routes/comment.route");
app.use("/user",userRouter);
app.use("/blog",blogRouter);
app.use("/contact",contactRouter);
app.use("/comment",commentRouter);

// Socet Chat //
io.on("connection", (socket) => {
  // console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    // console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    // console.log("User Disconnected", socket.id);
  });
});

// Listen Port //
server.listen(port, () => {
    console.log(`Your Port Is ${port}. `);
});