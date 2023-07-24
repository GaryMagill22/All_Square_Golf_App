const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config()
const port = 8000;

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


