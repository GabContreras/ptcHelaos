import { Schema, model } from "mongoose";

const pettyCashSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    employeeId: {
        type: Schema.Types.Mixed,
        ref: "employee",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true,
        maxlength: 200,
        trim: true

    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },
    previousBalance: {
        type: Number,
        required: true
    },
    currentBalance: {
        type: Number,
        required: true,
        
    }
}, {
    timestamps: true,
    strict: false
});

export default model("pettyCash", pettyCashSchema);