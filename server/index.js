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

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
