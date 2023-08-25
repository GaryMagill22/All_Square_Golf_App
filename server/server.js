const express = require('express');
const app = express();
require('dotenv').config()
const port = 8000;
const cookieParser = require('cookie-parser');
const cors = require("cors");


// CONFIG EXPRESS ===================================================================
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json(), express.urlencoded({ extended: true }));  // POST METHOD
app.use(cookieParser());


// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));


// ROUTES



const { userRoutes } = require('./routes/user.routes')
const { gameRoutes } = require('./routes/game.routes')
const { lobbyRoutes } = require('./routes/lobby.routes')
const { courseRoutes } = require('./routes/course.routes')
const { roundRoutes } = require('./routes/round.routes')


app.use('/api/lobbys', lobbyRoutes)
app.use('/api/users', userRoutes)
app.use('/api/games', gameRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/rounds', roundRoutes)

require("./config/mongoose.config");

// MODELS IMPORT
const Lobby = require('./models/lobby.model');


// update lobby with players
// app.post('/api/lobbys/update/:lobbyId', async (req, res) => {
//     const lobbyId = req.params.lobbyId;
//     const newPlayer = req.body.newPlayer;

//     const lobby = await Lobby.findById(lobbyId);  // This assumes you're using something like Mongoose with MongoDB

//     if (!lobby) {
//         return res.status(404).send('Lobby not found');
//     }

//     lobby.players.push(newPlayer);

//     await lobby.save();

//     res.status(200).send('Player added successfully');
// });






// SOCKETS.IO //
//==========================================================================================================================================


// created variable called server listening on port 8000
const server = app.listen(port, () => console.log(`Listening on port: ${port}`));


// // importing socket.io module and attatching it to our server
const io = require("socket.io")(server, { cors: true });


const rooms = [];
// Each client that connects get their own socket id.
io.on("connection", (socket) => {
    //let socketToUserId = {};
    //console.log(`User connected: ${socket.id}`);
    // if this is logged in our node terminal, that means new client successfully has completed handshake 
    // socket.on("chat", (client_input) => {
    //     console.log("got a message", client_input);
    //     // io.broadcast.emit("got a message", client_input);
    //     io.emit("post chat", client_input);
    // })

    // socket.on('user_logged_in', ({ userId }) => {
    //     socketToUserId[socket.id] = userId;
    // });




    // Join a room
    // socket.on('join', (roomName) => {
    //     if (!rooms[roomName]) {
    //         rooms[roomName] = [];
    //     }
    //     rooms[roomName].push(socket.id);
    //     socket.join(roomName);
    //     io.to(roomName).emit('playerJoined', rooms[roomName]);
    // });

    // Leave a room
    // socket.on('leave', (roomName) => {
    //     if (rooms[roomName]) {
    //         rooms[roomName] = rooms[roomName].filter((id) => id !== socket.id);
    //         socket.leave(roomName);
    //         io.to(roomName).emit('playerLeft', rooms[roomName]);
    //     }
    // });


    // // Create Round 
    // socket.on('create_round', () => {

    // });

    // // Delete userId when disconnects
    // socket.on('disconnect', () => {
    //     delete socketToUserId[socket.id];
    // });

    socket.on('joinLobby', (lobbyId) => {
        const isLobbyExist = Lobby.findById(lobbyId, (err, lobby) => {
            if (err) {
                console.error('Error locating lobby:', err);
                return;
            }

            if (!lobby) {
                console.error('Lobby not found');
                return;
            }

            if (lobby.lobbyId !== lobbyId) {
                console.log('Invalid Join key');
                return;
            }

            socket.emit('joinSuccess', 'User joined successfully');
        })
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
})
// ==========================================================================================================================================

// NEW SOCKET.IO SERVER     =======================================================================================



