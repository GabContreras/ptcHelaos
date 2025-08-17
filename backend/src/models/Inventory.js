import { Schema, model } from "mongoose";

const inventorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    supplier: {
        type: String,
        trim: true
    },
    extraPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    unitType: {
        type: String,
        enum: ["kilogramos", "kilos", "unidades", "litros", "libras", "gramos"],
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    // Array de IDs de lotes (solo referencias)
    batchId: [{
        type: Schema.Types.ObjectId,
        ref: "batch"
    }],
    // Stock total calculado
    currentStock: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true,
    strict: false

});
export default model("inventory", inventorySchema);