const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
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
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});

//before save user, hashing password
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();
    
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next) {
   this.find({active: {$ne: false}});
   next(); 
});

//compare passwords for login to system
userSchema.methods.correctPassword = async (candidatePass, userPass) => {
    return await bcrypt.compare(candidatePass, userPass);
};

//check password was changed
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {

        const changedTimestamp = parseInt(this.passwordChangedAt / 1000, 10);

        console.log(changedTimestamp, JWTTimestamp);

        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

//create reset token
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 100;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;