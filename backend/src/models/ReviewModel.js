import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, {
    timestamps: true
});

export default model("review", reviewSchema);