import {Schema, model} from "mongoose";

const categoriesSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true,
  strict: false
});

export default model("category", categoriesSchema)