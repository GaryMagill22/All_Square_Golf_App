const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
    username: {
        type: String,
        required: [true, "Username is required!"],
        minLength: [5, "Username must be atleast 5  long!"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: value => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(value),
            message: "Please enter a valid email"
        }
    },
    handicap: {
        type: Number,
        required: [true, "Handicap is required!"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be 8 characters or longer"]
    },
    rounds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rounds'
    }]


}, { timestamps: true });

UserSchema.virtual('confirmPassword')
    .get(() => this._confirmPassword)
    .set(value => this._confirmPassword = value);



UserSchema.pre('validate', function (next) {
    // console.log(this.password)
    // console.log("HELLO")
    // console.log(this.get('confirmPassword'))
    // CHANGED LINE BELOW TOOK OUT "THIS.GET(CONFIRMPASSWORD)"
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password')
    }
    next()
})

UserSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            // console.log(hash)
            next()
        })
})

module.exports.User = mongoose.model('User', UserSchema);


