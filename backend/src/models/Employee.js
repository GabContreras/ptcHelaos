import {Schema, model} from "mongoose";

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
  }
}, {
  timestamps: true,
  strict: false
});

export default model("employee", employeesSchema)