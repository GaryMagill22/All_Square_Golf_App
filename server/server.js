// const express = require('express');
// const app = express();
// const cors = require('cors');
// require('dotenv').config();
// app.set("view engine", "ejs");
// // app.use(express.static("public"));
// const cookieParser = require('cookie-parser');
// // const http = require("http");
// // const { Server } = require('socket.io')
// app.use(cors());

// const port = 8000;
// const db = "my_db"

// // CONFIG EXPRESS
// // app.use(cors()) // Having 2 localhost port to communicate
// app.use(cors({
//     credentials: true,
//     origin: 'http://localhost:3000'
// }));


// app.use(express.json(), express.urlencoded({ extended: true }));  // POST METHOD
// app.use(cookieParser());

// // module.exports = require('./config/mongoose.config')(db)

// const initializeMongoose = require('./config/mongoose.config');
// // initializeMongoose(db);


// // ROUTES


// const { userRoutes } = require('./routes/user.routes')
// const { gameRoutes } = require('./routes/game.routes')
// const { lobbyRoutes } = require('./routes/lobby.routes')
// const { courseRoutes } = require('./routes/course.routes')
// const { roundRoutes } = require('./routes/round.routes')


// // app.use('/api/auth', require('./routes/auth.routes'));
// // app.use('/api/users', require('./routes/user.routes'));

// app.use('/api/lobbys', lobbyRoutes)
// app.use('/api/users', userRoutes)
// app.use('/api/games', gameRoutes)
// app.use('/api/courses', courseRoutes)
// app.use('/api/rounds', roundRoutes)

// // require("./config/mongoose.config");








// // const server = http.createServer(app);

// // const io = new Server(server, {
// //     cors: {
// //         origin: "http://localhost:3000",
// //         methods: ["GET", "POST"],
// //     },
// // })


// // io.on("connection", (socket) => {
// //     console.log(`User Connected: ${socket.id}`);

// //     socket.on("send_message", (data) => {
// //         socket.broadcast.emit("reaceive_message", data)
// //     })
// // });


// app.listen(port, () => {
//     console.log("Server is running on port", port + "!")
// });





// emitters - passes data where it needs to go (emit)
// on - trigger - listening for a particular event

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = 8000;
app.set("view engine", "ejs");
app.use(express.static("public"));
const cookieParser = require('cookie-parser');


// CONFIG EXPRESS
// app.use(cors()) // Having 2 localhost port to communicate
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json(), express.urlencoded({ extended: true }));  // POST METHOD
app.use(cookieParser());
// Change the app.use(cors()) to the one below

// ROUTES



const { userRoutes } = require('./routes/user.routes')
const { gameRoutes } = require('./routes/game.routes')
const { lobbyRoutes } = require('./routes/lobby.routes')
const { courseRoutes } = require('./routes/course.routes')
const { roundRoutes } = require('./routes/round.routes')


// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/users', require('./routes/user.routes'));

app.use('/api/lobbys', lobbyRoutes)
app.use('/api/users', userRoutes)
app.use('/api/games', gameRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/rounds', roundRoutes)

require("./config/mongoose.config");


// require("./routes/user.routes")(app)
// const connectDB = require('./config/mongoose.config')
// connectDB()




app.listen(port, () => console.log(`Listening on port: ${port}`));

