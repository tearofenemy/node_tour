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
    avatar: String,
    password: {
        type: String,
        unique: true,
        required: [true, 'User must have a password'],
        minLength: [8, 'The password must be longer than 8 characters'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm your password password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            }
        }
    },
    passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.correctPassword = async (candidatePass, userPass) => {
    return await bcrypt.compare(candidatePass, userPass);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {

        const changedTimestamp = parseInt(this.passwordChangedAt / 1000, 10);

        console.log(changedTimestamp, JWTTimestamp);

        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;