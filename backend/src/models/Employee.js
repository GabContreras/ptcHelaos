/*
Fields:
name
lastName
email
password
phone
hireDate
salary
Dui
*/

import { Schema, model } from 'mongoose';

const employeeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
    },
    phone: {
        type: String,
        required: [true, 'El número de teléfono es obligatorio'],
        unique: true,
        validate: {
            validator: function (v) {
                // This regex allows for various phone number formats
                return /^[\d\s\-()]+$/.test(v);
            },
            message: props => `${props.value} no es un número de teléfono válido`
        },
        hireDate: {
            type: Date,
            default: Date.now
        },
        salary: {
            type: Number,
            required: [true, 'El salario es obligatorio'],
            min: [0, 'El salario no puede ser negativo']
        },
        dui: {
            type: String,
            required: [true, 'El DUI es obligatorio'],
            unique: true,
            validate: {
                validator: function (v) {
                    // This regex checks for a valid DUI format
                    return /^\d{8}-\d{1}$/.test(v);
                },
                message: props => `${props.value} no es un DUI válido`
            }
        }
    }
}, {
    timestamps: true,
    strict: false
});
export default model("Employee", employeeSchema);