const express = require ('express');
const User = require('./../Models/userModel');
const jwt = require ('jsonwebtoken');
const util = require('util');

const signToken = id => {
    return jwt.sign({id}, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    })
}

  

exports.signup =  async (req, res, next) => {
    try { 

        const newUser = await User.create(req.body);

        const token = signToken(newUser._id)


        res.status(201).json({
            status: "success",
            token,
            message: "new user created successfully!",
            data: {
                user: newUser
            }
        });

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
        
    }

}

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Check if email & password are provided
        if (!email || !password) {

            res.status(400).json({
                status: 'fail',
                message: "Please provide a valid email address & password for log in"
            });
            next();
        };


        // Check if user  exist with given email
        const user = await User.findOne({ email }).select('+password');

        const isMatch = await user.comparePasswordInDb(password, user.password);
        // Check if user exist and password matches
        if(!user || !isMatch){
            const error = "Incorrect email or password"
            return next(error);
        };
 
        const token = signToken(user._id )

        res.status(200).json({
            status: "success",
            token,
            message: "user looged in",
            data: {
                user
            } 
        });

        

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getAllUsers = async(req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: "success",
            length: users.length,
            data: {
              users
            }
          });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.protect = async (req, res, next) => {
    //read and check if token exists
    const testToken = req.headers.authorization

    let token;

    if (testToken && testToken.startsWith('Bearer')) {
         token = testToken.split(' ')[1]
    }
    console.log(token);


    //validate token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR)
    console.log(decodedToken);

    //check if user already exists
   const user = await User.findById(decodedToken.id);

   if(!user){
    const error = "user doesn't exist";
    next(error);
   } 

    //check if user changed password after token was issued
    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);

    if (isPasswordChanged){
        const error = "password has been changed, pls log in again";
        return next(error);
   };  

    // allow user access the route
    req.user = user;
    next();
}

exports.restrict = (role) => {
    return (req, res, next) => {
        if(req.user.role !== role){
            const error = "You can't perform this action";
            return next(error);
        }
        next();
    }
    
}