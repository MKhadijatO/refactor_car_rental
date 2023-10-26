const mongoose = require('mongoose');
// const fs = require('fs'); 
const User = require('./userModel');
const { ObjectId } = require('mongodb');
const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Make is a required field']
  },
  model: {
    type: String,
    required: [true, 'Make is a required field']
  },
  year: {
    type: Number,
    required: [true, 'Make is a required field'] 
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  carStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: false
  }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;