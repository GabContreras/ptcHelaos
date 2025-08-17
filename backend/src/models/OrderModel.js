import { Schema, model } from "mongoose";

const ingredientSchema = new Schema({
    ingredientId: {
        type: Schema.Types.ObjectId,
        ref: "inventory",
        required: false  // Cambiar a false para que sea opcional
    },
    // Agregar nombre como alternativa para ingredientes no registrados
    ingredientName: {
        type: String,
        required: false
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
        trim: true
    }
}, { _id: false });

const productOrderSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    flavors: [ingredientSchema], // Solo para helados (1-3 sabores)
    toppings: [ingredientSchema], // Helados y algún otro producto
    additions: [ingredientSchema], // Para otros productos (café con azúcar, waffle con miel, etc.)
    specialInstructions: String,
    subtotal: Number
}, { _id: false });

const orderSchema = new Schema({
    // Cliente: ObjectId para cuentas registradas, null para ventas en local
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "customer"
    },
    // Datos del cliente (solo para ventas en local sin cuenta)
    customerName: String,
    customerPhone: String,
    
    // Empleado: ObjectId para ventas en local, "online" para ventas en línea
    employeeId: {
        type: Schema.Types.Mixed,
        ref: "employee"
    },
    
    products: [productOrderSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["efectivo", "tarjeta"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pagado", "pendiente", "rechazado","reembolsado","cancelado"],
        required: true
    },
    orderStatus: {
        type: String,
        enum: ["pendiente", "en preparación", "en camino", "entregado", "cancelado"],
        required: true
    },
    orderType: {
        type: String,
        required: true,
        enum: ["delivery", "local"]
    },
    deliveryAddress: String,
    reviewId: {
        type: Schema.Types.ObjectId,
        ref: "review"
    }
}, {
    timestamps: true,
    strict: false
});

export default model("order", orderSchema);