import {Schema, model} from "mongoose";

const employeesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
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
  image: {
    type: String,
    default: ""
  }
}, {
  timestamps: true,
  strict: false
});

export default model("employee", employeesSchema)