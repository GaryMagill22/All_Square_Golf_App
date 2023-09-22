const mongoose = require('mongoose');
const username = process.env.ATLAS_USERNAME
const dbPassword = process.env.ATLAS_PASSWORD
const db = process.env.DB




// mongoose.connect(`mongodb+srv://${username}:${dbPassword}@allsquare.mouahaa.mongodb.net/${db}`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log("Established a connection to the database"))
//     .catch(err => console.log("Something went wrong when connecting to the database", err));

//module.exports = db;

mongoose.connect((`mongodb+srv://${username}:${dbPassword}@mongopractice.zp13odz.mongodb.net/${db}`), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Established a connection to the database"))
    .catch(err => console.log("Something went wrong when connecting to the database", err));

module.exports = db;

// mongoose.connect((`mongodb+srv://${username}:${dbPassword}@allsquare.mouahaa.mongodb.net/?retryWrites=true&w=majority/${db}`), {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log("Established a connection to the database"))
//     .catch(err => console.log("Something went wrong when connecting to the database", err));




// mongoose.connect((`mongodb://localhost:27017/${db}`), {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log("Established a connection to the database"))
//     .catch(err => console.log("Something went wrong when connecting to the database", err));
