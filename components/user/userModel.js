const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// const { prependListener } = require('./carModel');
const Car = require('./../car/carModel');

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: [true, 'Full name is required']
    },
    email:{
        type: String,
        required: [true, 'email is required'],
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, 'provide a valid email']
    },
    phonenumber:{
        type: Number,
        required: [true, 'phone number is required']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            validator: function(val){
                return val == this.password
            }, 
            message: 'Confirm Password does not match the password'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    cars: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Car',
          default: []
        },
      ], 
    passwordChangedAt: Date,   
})

userSchema.pre('save', async  function (next) {
    if (!this.isModified('password')) return next();

    // password encryption
    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;

    next();
})

userSchema.methods.comparePasswordInDb = async (pswd, pswdDB) => {
    return await bcrypt.compare(pswd, pswdDB)
};

userSchema.methods.isPasswordChanged = async function (JWTTimestamp) {
    if(this.passwordChangedAt){
        const pswdChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(pswdChangedTimestamp, JWTTimestamp);

        return JWTTimestamp < pswdChangedTimestamp;
    }
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;