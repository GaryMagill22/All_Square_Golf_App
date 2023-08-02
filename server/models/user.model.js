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
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
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
    round: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rounds'
    }],
    stripeCustomerId: {
        type: String,
        default: null,
    }


}, { timestamps: true });

UserSchema.virtual('confirmPassword')
    .get(() => this._confirmPassword)
    .set(val => this._confirmPassword = val)



UserSchema.pre('validate', function (next) {
    console.log(this.password)
    console.log("HELLO")
    console.log(this.get('confirmPassword'))
    if (this.password !== this.get('confirmPassword')) {
        this.invalidate('confirmPassword', 'Password must match confirm password')
    }
    next()
})

UserSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash
            console.log(hash)
            next()
        })
})

module.exports.User = mongoose.model('User', UserSchema);




// const mongoose = require('mongoose');


// const UserSchema = new mongoose.Schema({
//     firstName: {
//         type: String,
//         required: [true, "First Name is required!"],
//         minLength: [2, "Full Name needs to be more than 2 characters"]
//     },
//     lastName: {
//         type: String,
//         required: [true, "Last Name is required!"],
//         minLength: [2, "Full Name needs to be more than 2 characters long"]
//     },
// userName: {
//     type: String,
//     required: [true, "Username is required!"],
//     minLength: [5, "Username must be atleast 5  long!"]
// },
//     email: {
//         type: String,
//         required: [true, "Email is required!"],
//         minLength: [8, "Email must be atleast 5 characters long!"]
//     },
//     password: {
//         type: String,
//         required: [true, "Password is required!"],
//         minLength: [5, "Password must be atleast 5 characters long!"]
//     },
// handicap: {
//     type: Number,
//         required: [true, "Handicap is required!"],
//     }

// }, { timestamps: true })
// // set confirmPassword as a virtual field so it doesn't get stored in DB
// UserSchema.virtual("confirmPassword");
// // validate that password and confirm password match when registering
// UserSchema.pre("validate", function (next) {
//     if (this.password !== this.confirmPassword) {
//         this.invalidate("confirmPassword", "Password must match confirm password");
//     }
//     next();
// });
// // hash the password before storing in db
// UserSchema.pre("save", async function (next) {
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });
// // define a static method for our model to handle login validations
// UserSchema.statics.validateLogin = async function ({ email, password }) {
//     const user = await this.findOne({ email });
//     if (!(user && await bcrypt.compare(password, user.password))) {
//         throw new this().invalidate("password", "Invalid Credentials");
//     }
//     return user;
// };

// module.exports = mongoose.model("User", UserSchema);


// const User = mongoose.model('user', UserSchema)

// module.exports = User;

