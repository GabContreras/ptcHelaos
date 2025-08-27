import {Schema, model} from "mongoose";

const categoriesSchema = new Schema({
  name: {
    type: String,
    maxlength: 100,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    maxlength: 50,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true,
    trim: true
  }
}, {
  timestamps: true,
  strict: false
});

export default model("events", categoriesSchema)