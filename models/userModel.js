const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: [7, 'The username cannot be less than 7'],
        maxLength: [15, 'The username cannot be greater than 15']
    },
    email: {
        type: String,
        required: [true, 'User must have a email'],
        validate: [validator.isEmail, 'Email is not a valid'],
        unique: true,
        lowercase: true
    },
    avatar: {
        type: String,
        required: [true, 'User must have a avatar'],
    },
    password: {
        type: String,
        unique: true,
        required: [true, 'User must have a password'],
        minLength: [8, 'The password must be longer than 8 characters']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm your password password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            }
        }
    }
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;