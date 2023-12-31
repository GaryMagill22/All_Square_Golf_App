// Load environment variables from .env files
const dotenv = require('dotenv');
dotenv.config();

// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');


// Import Routes
const { userRoutes } = require('./routes/user.routes')
const { gameRoutes } = require('./routes/game.routes')
const { lobbyRoutes } = require('./routes/lobby.routes')
const { courseRoutes } = require('./routes/course.routes')
const { roundRoutes } = require('./routes/round.routes');
const { walletRoutes } = require('./routes/wallet.routes');


// Import Socket.IO
const { Server } = require("socket.io");

// Load your models
const Wallet = require('./models/wallet.model');
const GameScoreCard = require('./models/gameScorecard.model');
const Lobby = require('./models/lobby.model');

// Set Up Mongoose connection
require('./config/mongoose.config');

// Server port
const port = 8000;




// Middlewares ===================================================================

// Enable CORS with options
app.use(cors({
    credentials: true,
    origin: 'https://allsquare.club',
}));

app.use(cors());

// Regular JSON and URL-encoded data middleware


// Middleware for Stripe webhook to capture raw body
app.use(express.json({
    verify: function (req, res, buf) {
        var url = req.originalUrl;
        if (url.startsWith('/api/wallet/payment-webhook')) {
            req.rawBody = buf.toString()
        }
    }
})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes ========================================================================
app.use('/api/lobbys', lobbyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/wallet', walletRoutes);

// Welcome route
app.get('/', (req, res) => {
    console.log("Welcome to the All Square Golf Server");
    res.send("Welcome to the All Square Golf Server");
});

// HTTPS Server Setup ============================================================


// const options = {
//     key: fs.readFileSync('mssl.key'),
//     cert: fs.readFileSync('mssl.crt'),
// };

// const options = {
//     key: fs.readFileSync('/etc/ssl/private/mssl.key'),
//     cert: fs.readFileSync('/etc/ssl/certs/mssl.crt'),
// };




const server = https.createServer(app);


// Set up Socket.io on the same HTTPS server
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        credentials: true,
    },
});


// Socket Server and Express Server Listening on port 8000
server.listen(port, () => {
    console.log(`Express and Socket.IO Server started - Listening on port ${port}`);
});

const initiateGamePlay = async (payload) => {
    const { players, amount } = payload;

    // Use Promise.all to await all asynchronous calls
    const usersEligibilityStatus = await Promise.all(players.map(async (player) => {
        const userWalletData = await Wallet.findOne({ user: player._id });
        if (userWalletData.amount >= amount) {
            return {
                ...player,
                isEligible: true
            };
        } else {
            return {
                ...player,
                isEligible: false
            };
        }
    }));

    return usersEligibilityStatus;
};

function findNonEligibleUsers(data) {
    const nonEligibleUsers = data.filter(user => !user.isEligible);

    if (nonEligibleUsers.length === 0) {
        return {
            status: true,
            message: "All users are eligible."
        };
    } else {
        const userNames = nonEligibleUsers.map(user => user.username);
        const message = `users: ${userNames.join(', ')} cannot participate in the game due to low wallet balance`;
        return {
            status: false,
            message
        };
    }
}

const createGameScoreCard = async (players, lobbyId) => {
    try {
        await GameScoreCard.create({
            lobbyId,
            players: players.map((player) => ({ user_id: player._id, username: player.username, isConfirmed: false })),
        });

        console.log('New GameScorecard created for starting game on lobby:', lobbyId);
    } catch (err) {
        console.error('Error:', error);
    }
}

const checkScoreCard = async (lobbyId) => {
    try {
        const result = await GameScoreCard.aggregate([
            {
                $match: { lobbyId: lobbyId }
            },
            {
                $project: {
                    _id: 0,
                    allUsersConfirmed: {
                        $allElementsTrue: "$players.isConfirmed"
                    }
                }
            }
        ]);

        if (result.length === 0) {
            return false;
        }

        return result[0].allUsersConfirmed;
    } catch (error) {
        console.error("Error checking confirmation status:", error);
        return false;
    }
}


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

    socket.on('setBettingAmount', (data) => {
        io.emit('setBettingAmountReceived', data);
    });

    socket.on('gameCompleted', () => {
        io.emit('gameCompletedReceived');
    });

    socket.on('proceedToGame', async (data, teams) => {
        const gameplayResponse = await initiateGamePlay(data);
        const response = findNonEligibleUsers(gameplayResponse);

        // Create gamescorecard for users
        if (response.status) {
            createGameScoreCard(data.players, data.lobby);
        }

        io.emit('proceedToGameReceived', response, teams);
    });

    socket.on('winnersList', async (data) => {
        // Update score card
        const players = data[0].map(data => data.player);
        await GameScoreCard.findOneAndUpdate({
            lobbyId: data[2]
        }, { $set: { winners: players, winningAmount: data[1] } });

        io.emit('winnersListReceived', data);
    });

    socket.on('checkScoreCard', async (data) => {
        const allUsersConfirmed = await checkScoreCard(data);
        if (allUsersConfirmed) {
            io.emit('payoutIsConfirmedByAllParticipants');
        }
    });

    socket.on('payWinners', async (data) => {
        // Retrieve game scorecard and necessary details
        const gameScoreCard = await GameScoreCard.findOne({ lobbyId: data.lobby });
        if (gameScoreCard) {
            const allPlayers = gameScoreCard.players;
            const winners = gameScoreCard.winners;
            const winningAmount = gameScoreCard.winningAmount;
            const loosers = allPlayers.filter(player => !winners.includes(player.username));
            const winnersNames = allPlayers.filter(player => winners.includes(player.username));

            // Deduct money from losers wallet
            loosers.forEach(async (user) => {
                const userData = await Wallet.findOne({ user: user.user_id });
                userData.amount -= winningAmount;
                await userData.save();
                console.log('user wallet has been debited');
            });

            // Credit winners wallet
            winnersNames.forEach(async (user) => {
                const userData = await Wallet.findOne({ user: user.user_id });
                userData.amount += winningAmount;
                await userData.save();
                console.log('user wallet has bene credited');
            });

            // Delete data from game scorecard collection
            await GameScoreCard.findOneAndDelete({ lobbyId: data.lobby });
            console.log('game scorecard deleted');
        }
    });

    socket.on('addPlayerInTeamPlay', (data) => {
        io.emit('addPlayerInTeamPlayReceived', data);
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
// app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
//     const endpointSecret = "whsec_bVUixsBX7f7rlVvegivfLaGIiveyiFZV";
//     const sig = req.headers['stripe-signature'];
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//         console.log('--- event ---', event);
//     } catch (err) {
//         console.log('error', err.message);
//         res.status(400).send(`Webhook Error: ${err.message}`);
//         return;
//     }

//     res.send().end();
// });

// const server = app.listen(port, () => console.log(`Listening on port: ${port}`));

// const { Server } = require("socket.io");
// const io = new Server(server, { cors: true });


// ssl certificate key and certificates

// const options = {
//     key: fs.readFileSync('mssl.key'),
//     cert: fs.readFileSync('mssl.crt'),
// };



// Old way of oding it with options/key/cert
// const socketServer = require('https').createServer(options);
// const io = require('socket.io')(socketServer, {
//     cors: {
//             origin: '*',
//     },
// });



// old way to do stripe webhook
// app.use(express.json({
//     // Because Stripe needs the raw body, we compute it but only when hitting the Stripe callback URL.
//     verify: function (req, res, buf) {
//         var url = req.originalUrl;
//         if (url.startsWith('/api/wallet/payment-webhook')) {
//             req.rawBody = buf.toString()
//         }
//     }
// })
// );
