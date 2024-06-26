const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const http = require('http')
const dotenv = require('dotenv')
const socketIo = require('socket.io')
const mongoose = require('mongoose');
const cloudinary = ('cloudinary')


const path = require('path')
dotenv.config();

//cloudinary 
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// })

// const removeTemp = (path) => {
//   fs.unlink(path, err => {
//     if(err){
//       throw err
//     }
//   })
// }

//routes
const authRouter = require('./src/router/authRouter');
const carRouter = require('./src/router/carRouter');
const categoryRouter = require('./src/router/categoryRouter.js');
const subRouter = require('./src/router/subRouter');
const typeRouter = require('./src/router/typeRouter');
const fashionRouter = require('./src/router/fashionRouter');
const workRouter = require('./src/router/workRouter');
const userRouter = require('./src/router/userRouter');
const chatRouter = require('./src/router/chatRouter');
const messageRouter = require('./src/router/messageRouter');


const app = express();
const PORT = process.env.PORT || 4001;

const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        // origin: "http://localhost:3000",
        origin: "*",
        // methods: ["GET", "POST"]
    }
})

//to save filess for public
app.use(express.static(path.join(__dirname, 'src', 'public')))

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({useTempFiles: true}));
app.use(cors());

// routes use
app.use('/api/auth', authRouter);
app.use('/api/category', categoryRouter);
app.use('/api/sub', subRouter);
app.use('/api/type', typeRouter);
app.use('/api', fashionRouter);
app.use('/api', workRouter);
app.use('/api', carRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

// websocket functions
let activeUsers = [];

io.on("connection", (socket) => {
    socket.on("new-user-added", (newUserId) => {
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
      }
  
      io.emit("get-users", activeUsers);
    });
  
    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
  
      io.emit("get-users", activeUsers);
    });
  
    socket.on("exit", (id) => {
      activeUsers = activeUsers.filter((user) => user.userId !== id);
  
      io.emit("get-users", activeUsers);
    });

  
    socket.on("send-message", (data) => {
        const { receivedId } = data;
        const user = activeUsers.find((user) => user.userId === receivedId);
        if (user) {
            io.to(user.socketId).emit("answer-message", data);
      }
    });

    socket.on("is-reading", (id) => {
      io.emit('is-checked', id)
    })

    socket.on('delete-message', () => {
      io.emit('deleted')
    })
  });

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {})
.then(() => {
    server.listen(PORT, () => console.log(`Server stared on port: ${PORT}`));
})
.catch(error => console.log(error));
