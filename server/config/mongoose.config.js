const mongoose = require('mongoose');
const username = process.env.ATLAS_USERNAME
const dbPassword = process.env.ATLAS_PASSWORD
const db = process.env.DB


// mongodb + srv://garymagill22:<password>@mongopractice.zp13odz.mongodb.net/


mongoose.connect((`mongodb+srv://${username}:${dbPassword}@mongopractice.zp13odz.mongodb.net/?retryWrites=true&w=majority${db}`), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Established a connection to the database"))
    .catch(err => console.log("Something went wrong when connecting to the database", err));

module.exports = db;

