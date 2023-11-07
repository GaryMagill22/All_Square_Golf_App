const mongoose = require('mongoose');
require('dotenv').config();


const username = process.env.ATLAS_USERNAME
const dbPassword = encodeURIComponent(process.env.ATLAS_PASSWORD);
const db = process.env.DB


// mongoose.connect(`mongodb+srv://${username}:${dbPassword}@mongopractice.zp13odz.mongodb.net/${db}?retryWrites=true&w=majority`)
//     .then(() => console.log("Established a connection to the MongoDB database"))
//     .catch(err => console.log("Something went wrong when connecting to the database", err));



mongoose.connect((`mongodb+srv://${username}:${dbPassword}@mongopractice.zp13odz.mongodb.net/${db}?retryWrites=true&w=majority`))
    .then(() => console.log("Established a connection to the MongoDB database"))
    .catch(err => console.log("Something went wrong when connecting to the database", err));


