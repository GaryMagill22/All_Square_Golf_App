const mongoose = require('mongoose');
const username = process.env.ATLAS_USERNAME
const dbPassword = process.env.ATLAS_PASSWORD
const db = process.env.DB




mongoose.connect((`mongodb+srv://${username}:${dbPassword}@mongopractice.zp13odz.mongodb.net/${db}`))
    .then(() => console.log("Established a connection to MongoDB database"))
    .catch(err => console.log("Something went wrong when connecting to MongoDB", err));


    module.exports = db;



    // mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    // .then(() => {
    //     console.log('Connected to MongoDB');
    //     // Additional server setup and route handling can go here
    //     app.listen(port, () => {
    //         console.log(`Server is running on port ${port}`);
    //     });
    // })
    // .catch((err) => {
    //     console.error('Error connecting to MongoDB:', err);
    // });