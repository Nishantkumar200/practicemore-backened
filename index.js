import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userrouter from './router/userRoute.js';
import questionRoute from "./router/questionRoute.js";
import executionRoute from "./router/codeExecutionRoute.js";
import { sessionRoute } from "./router/sessionRoute.js";
import {Server} from 'socket.io';
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;


app.use("/",(req,res) =>{
  res.send("Api is running now")
})


//All routing goes here
app.use("/user/",userrouter);
app.use("/challenge/",questionRoute)
app.use("/code",executionRoute)
app.use(sessionRoute)

const db = mongoose.connect("mongodb+srv://nishant1234:nishant1234@cluster0.kr2s6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
  useUnifiedTopology: true,
  useFindAndModify:true,
  useCreateIndex:true,
  useNewUrlParser:true

});
db.then(() => console.log("Successfully connnected to the database")).catch(
  (err) => console.log(err)
);

// socket server


const server = app.listen(PORT, () => console.log(`Server is running now on port ${PORT}`));
const io = new Server(server);

io.on('connection',(socket) =>{
  socket.on('sendMessage',(data) =>{
    console.log("connected")
    io.sockets.emit('sendMessage',(data));
  })

  socket.on('canvas-data',(data) =>{
    socket.broadcast.emit('canvas-data',data)
  })
})
