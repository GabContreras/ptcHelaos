import { Schema, model } from "mongoose";

const customersSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true

  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  address: [{

  }],
  password: {
    type: String,
    required: true,
    trim: true
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