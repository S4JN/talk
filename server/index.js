const express = require("express");
const cors = require("cors");
const chats = require("./data/data");
const app = express();
const dotenv = require("dotenv");
const Connection = require("./config/db");
const userRoutes = require("./routes/userRoute");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware")
const messageRoutes = require("./routes/messageRoutes");


app.use(cors());
dotenv.config();
Connection();
app.use(express.json());




app.get("/", (req, res) => {
  res.end("hi");
});

app.use("/api/user", userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

app.use(notFound);
app.use(errorHandler);


const port = 8080 || process.env.PORT;

const server= app.listen(port, () => {
  console.log(`server running on port ${port}`);
});


const io = require("socket.io")(server,{
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});


io.on("connection",(socket)=>{
  console.log("socket");

  socket.on("setup",(userData)=>{
    socket.join(userData._id);
    
    socket.emit("connected");
  });

  socket.on("join_chat",(room)=>{
    socket.join(room);
    console.log("User joined Room: " +room);
  })

socket.on("typing",(room)=>socket.in(room).emit("typing"));
socket.on("stop_typing",(room)=>socket.in(room).emit("stop_typing"));


  socket.on("new_message",(newMessageRecieved)=>{
      var chat = newMessageRecieved.chat;
      //console.log(newMessageRecieved);
      if(!chat.users) return console.log("chat of user not defined");

      chat.users.forEach(user => {
        if(user._id == newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message_recived",newMessageRecieved)
      });

  })

  socket.off("setup",()=>{
    console.log("user Disconnected");
    socket.leave(userData._id);
  });

})