import { Schema, model } from "mongoose";

const customersSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
   
    
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 15

  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  addresses: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    }
  }],
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8

  },
  birthday: {
    type: Date,
    required: true
  },
  frequentCustomer: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockTime: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  strict: false
});

export default model("customer", customersSchema)