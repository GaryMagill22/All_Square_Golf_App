// Load environment variables first
const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: envPath });


const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8000;
const cors = require("cors");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Wallet } = require('./models/wallet.model');
const GameScoreCard = require('./models/gameScorecard.model');
const fs = require('fs');
const { userRoutes } = require('./routes/user.routes')
const { gameRoutes } = require('./routes/game.routes')
const { lobbyRoutes } = require('./routes/lobby.routes')
const { courseRoutes } = require('./routes/course.routes')
const { roundRoutes } = require('./routes/round.routes');
const { walletRoutes } = require('./routes/wallet.routes');
const Lobby = require('./models/lobby.model');




// ROUTES
app.use('/api/lobbys', lobbyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/wallet', walletRoutes);

require("./config/mongoose.config");


const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ?
    process.env.ALLOWED_ORIGINS.split(",") :
    ['http://localhost:3000', 'https://allsquare.club'];

console.log('Allowed Origins for CORS:', ALLOWED_ORIGINS);


CORS Configuration
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        console.log('Origin of request: ', origin);
        console.log('Current ALLOWED_ORIGINS:', ALLOWED_ORIGINS);
        // If no origin or it's in the allowed list, call callback with true, else with an error message
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            console.log('Allowed by CORS');
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    }
};



app.use(cors(corsOptions));


app.use(express.json({
    // The verify function is for raw body parsing for Stripe
    verify: function (req, res, buf) {
        var url = req.originalUrl;
        if (url.startsWith('/api/wallet/payment-webhook')) {
            req.rawBody = buf.toString()
        }
    }
})
);

// Body parser for URL-encoded bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Middleware for parsing cookies
app.use(cookieParser());




app.get('/', (req, res) => {
    res.send("Welcome to the server");
});


//


// changed to this to connect to database
const socketServer = require('https').createServer(app);
const io = require('socket.io')(socketServer, {
    cors: {
        origin: '*',
    },
});



// Express server listening on port 8000
app.listen(PORT, () => console.log(`Express Server Listening on port: ${PORT}`));

// Socket.io listening on port 9000 
socketServer.listen(9000, () => {
    console.log(`Socket Server is started on port 9000`);
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


// Old way of oding it with options/key/cert
// const socketServer = require('https').createServer(options);
// const io = require('socket.io')(socketServer, {
//     cors: {
//             origin: '*',
//     },
// });


// const server = app.listen(port, () => console.log(`Listening on port: ${port}`));

// const { Server } = require("socket.io");
// const io = new Server(server, { cors: true });


// const options = {
//     key: fs.readFileSync('/etc/ssl/private/mssl.key'),
//     cert: fs.readFileSync('/etc/ssl/certs/mssl.crt'),
// };
