
const express = require("express");
const Message=require("./models/Message");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const User = require("./models/User");

const app = express();
const server = http.createServer(app);

/* -------------------- MIDDLEWARE -------------------- */

app.use(
  cors(
    {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  )
);

app.use(express.json());

/* -------------------- SOCKET.IO -------------------- */

const io = new Server(
  server,
  {
    cors:
    {
      origin: "http://localhost:5173"
    }
  }
);


/* -------------------- ROUTES -------------------- */

// SIGNUP
app.post(
  "/signup",
  async (req, res) =>
  {
    try
    {
      const { username, email, password } = req.body;

      if (!username || !email || !password)
      {
        return res.status(400).json("All fields are required");
      }

      const existingUser = await User.findOne({ email });

      if (existingUser)
      {
        return res.status(409).json("User already exists");
      }

      const newUser = new User({ username, email, password });
      await newUser.save();

      res.status(201).json("Signup successful");
    }
    catch (err)
    {
      console.error("Signup error:", err);
      res.status(500).json("Server error");
    }
  }
);

// LOGIN
app.post(
  "/login",
  async (req, res) =>
  {
    try
    {
      const { email, password } = req.body;

      if (!email || !password)
      {
        return res.status(400).json("Email and password required");
      }

      const user = await User.findOne({ email });

      if (!user || user.password !== password)
      {
        return res.status(401).json("Invalid email or password");
      }

      res.json(
        {
          _id: user._id,
          username: user.username,
          email: user.email
        }
      );
    }
    catch (err)
    {
      console.error("Login error:", err);
      res.status(500).json("Server error");
    }
  }
);
io.on("connection", async(socket) => {
  const username = socket.handshake.query.username;
  const oldMessages=await Message.find().sort({date:1}).limit(20);
  socket.emit("oldMessages",oldMessages);
  console.log("User connected:", socket.id, username);

  // user joined
  if (username) {
    io.emit("userNotification", {
      message: `${username} joined the chat`
    });
  }

  // receive chat messages
  socket.on("sendMessage", async(data) => 
    {const newMessage=new Message(
      {
        user:data.user,text:data.text
      }
    );
    await newMessage.save();
  
    io.emit("receiveMessage", {
      user:data.user,text:data.text
    });
  });

 
  // user disconnected
  socket.on("disconnect", () => {
    if (username) {
      io.emit("userNotification", {
        message: `${username} left the chat`
      });
    }
    console.log("User disconnected:", socket.id);
  });
});


/* -------------------- DATABASE + SERVER START -------------------- */

mongoose.connect(
  ,
  {
    serverSelectionTimeoutMS: 5000
  }
)
.then(
  () =>
  {
    console.log("MongoDB connected");

    server.listen(
      3001,
      () =>
      {
        console.log("Server running on port 3001");
      }
    );
  }
)
.catch(
  err =>
  {
    console.error("MongoDB connection failed:", err);
  }
);


