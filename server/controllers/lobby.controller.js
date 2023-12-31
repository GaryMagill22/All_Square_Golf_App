const Lobby = require("../models/lobby.model")


const generateRandomRoomName = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let roomName = '';
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        roomName += characters.charAt(randomIndex);
    }
    return roomName;
};

// Create new Lobby
module.exports.createLobby = async (req, res) => {
    try {
        const { selectedCourse, selectedGame } = req.body;
        const lobby = await Lobby.create({
            selectedCourse,
            selectedGame,
            players: [req.user.id],
            lobbyId: generateRandomRoomName(),
            creatorId: req.user.id,
        });
        res.status(200).json({
            message: 'Lobby created',
            lobby
        });
    } catch (err) {
        res.status(500).json(err);
    }
}


// GeT all Lobby
module.exports.getAllLobbys = (req, res) => {
    Lobby.find({})
        .then(lobby => res.json(lobby))
        .catch(err => res.json(err))
}


// Read One Lobby
module.exports.getOneLobby = (req, res) => {
    // const idFromParams = req.params.id
    Lobby.findById(req.params.id)
        .then((oneLobby) => { res.json(oneLobby) })
        .catch((err) => { res.json({ err: err }) })
}


//Update one Lobby
module.exports.updateLobby = (req, res) => {
    Lobby.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true })
        .then(updatedLobby => res.json(updatedLobby))
        .catch((err) => res.status(400).json(err))
}



// Delete one Lobby
module.exports.deleteLobby = (req, res) => {
    Lobby.deleteOne({ _id: req.params.id })
        .then(deleteLobby => res.json(deleteLobby))
        .catch(err => res.json(err))
}


//==============================================================================


// CHANGED FINDONE(ID: LOBBYID) TO(LOBBYID: LOBBYID)
module.exports.updateUsersByLobbyId = async (lobbyId, playerId) => {
    try {
        const lobby = await Lobby.findOne({ lobbyId: lobbyId });

        if (!lobby) {
            throw new Error('Lobby not found');
        }

        // Only add playerId if it's not already in the array
        if (!lobby.players.includes(playerId)) {
            lobby.players.push(playerId);
        }

        const updatedLobby = await lobby.save();
        return updatedLobby;
    } catch (error) {
        console.error('Error updating users:', error);
        throw error;
    }
}


module.exports.getUsersByLobbyId = async (lobbyId) => {
    try {
        const lobby = await Lobby.findOne({ lobbyId }).populate('players');
        return lobby ? lobby.players : [];
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
}