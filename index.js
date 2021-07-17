import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userrouter from "./router/userRoute.js";
import questionRoute from "./router/questionRoute.js";
import executionRoute from "./router/codeExecutionRoute.js";
import { sessionRoute } from "./router/sessionRoute.js";
import { Server } from "socket.io";
import pino from "express-pino-logger";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import config from "./config.js";
import { videoToken } from "./tokens.js";

app.use(cors());
app.use(pino());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: false }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is up now");
});

// for video calling

const sendTokenResponse = (token, res) => {
  res.set("Content-Type", "application/json");
  res.send(
    JSON.stringify({
      token: token.toJwt(),
    })
  );
};

// app.get("/greeting", (req, res) => {
//   res.send("hello world");
//   const name = req.query.name || 'World';
//   res.setHeader('Content-Type', 'application/json');
//   res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
// });

app.get("/video/token", (req, res) => {
  const identity = req.query.identity;
  const room = req.query.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});
app.post("/video/token", (req, res) => {
  const identity = req.body.identity;
  const room = req.body.room;
  console.log(identity, room);
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

//All routing goes here
app.use("/user", userrouter);
app.use("/challenge", questionRoute);
app.use("/code", executionRoute);
app.use(sessionRoute);
app.use('/greeting',userrouter)

// process.env.MONGODB_URI ||
const db = mongoose.connect("mongodb://localhost:27017/summerInovation", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
});

db.then(() => console.log("Successfully connnected to the database")).catch(
  (err) => console.log(err)
);

// socket server
const server = app.listen(PORT, () =>
  console.log(`Server is running now on port ${PORT}`)
);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("sendMessage", (data) => {
    console.log("connected");
    io.sockets.emit("sendMessage", data);
  });

  socket.on("canvas-data", (data) => {
    socket.broadcast.emit("canvas-data", data);
  });
});
