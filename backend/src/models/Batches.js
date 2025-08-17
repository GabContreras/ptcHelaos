import { Schema, model } from "mongoose";
const batchSchema = new Schema({
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    expirationDate: {
        type: Date
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['En uso', 'Agotado', 'Vencido', 'Dañado'],
        default: 'En uso'
    },
    completedDate: {
        type: Date
    },
    notes: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Array de movimientos asociados a este lote
    movements: [
        {
            type: {
                type: String,
                enum: [
                    'entrada',    // Nuevo stock, devoluciones, ajustes positivos
                    'salida',     // Consumo, ventas, ajustes negativos
                    'daño'        // Producto dañado, vencido, etc
                ],
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 0
            },
            reason: {
                type: String,
                required: true,
                trim: true
            },
            employeeId: {
                type: Schema.Types.Mixed,
                ref: "employee",
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true,
    strict: false
});
export default model("batch", batchSchema);