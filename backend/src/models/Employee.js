import { Schema, model } from "mongoose";

const employeesSchema = new Schema({
  name: {
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
  phone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true,

  },
  hireDate: {
    type: Date,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  dui: {
    type: String,
    required: true,
    unique: true
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

export default model("employee", employeesSchema)