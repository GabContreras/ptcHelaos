import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    images: [
        {
            url: {
                type: String,
                required: true
            }
        }
    ],
    available: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: String,
        trim: true

    },
    basePrice: {
        type: Number,
        required: true,
        trim: true

    }
}, {
    timestamps: true,
    strict: false
});

export default model("product", productSchema);