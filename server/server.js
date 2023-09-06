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
const { Server } = require("socket.io");
const io = new Server(server, { cors: true });


const rooms = [];
// Each client that connects get their own socket id.
io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected from client side`);

    socket.on('joinLobby', async (lobbyId) => {
        try {
            const lobby = await Lobby.findOne({
                lobbyId
            }).populate({
                path: 'players',
                model: 'User',
                select: 'username'
            });
            if (!lobby) {
                console.error('Lobby not found');
                return;
            }

            if (lobby.lobbyId !== lobbyId) {
                console.log('Invalid Join key');
                return;
            }
            socket.join(lobbyId)
            io.in(lobbyId).emit('joinSuccess', {
                message: 'User joined successfully',
                players: lobby
            });
        } catch (err) {
            console.error('Error locating lobby:', err);
            return;
        }
    })

    socket.on('submitScore', (data) => {
        console.log('i got called');
        io.emit('alertUsers', data);
    });

    socket.on('holeNumber', (data) => {
        io.emit('holeNumberReceived', data + 1);
    });

    socket.on('points', (data) => {
        io.emit('pointsReceived', data);
    });

    socket.on('players', (data) => {
        io.emit('playersReceived', data);
    });

    socket.on('gameCompleted', () => {
        io.emit('gameCompletedReceived');
    });

    socket.on('proceedToGame', () => {
        io.emit('proceedToGameReceived');
    })





    socket.on('gameCompleted', () => {
        io.emit('gameCompletedReceived');
    });

    socket.on('logout', () => {
        console.log(`User logged out: ${socket.id}`);
        socket.disconnect();
        console.log("User disconnected ")
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

    });
});
// ==========================================================================================================================================

// NEW SOCKET.IO SERVER     =======================================================================================