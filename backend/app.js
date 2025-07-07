//funciones de la app, tipo login, crud, registros, etc

//inserto todo lo de la libreria express
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import employeesRoutes from "./src/routes/employeeRoutes.js";
import customersRoutes from "./src/routes/customerRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import inventoryRoutes from "./src/routes/inventoryRoutes.js";
import loginRoutes from "./src/routes/loginRoutes.js";
import logoutRoutes from "./src/routes/logoutRoutes.js";
import registerCustomerRoutes from "./src/routes/registerCustomerRoutes.js";
import registerEmployeeRoutes from "./src/routes/registerEmployeeRoutes.js";
import passwordRecoveryRoutes from "./src/routes/passwordRecoveryRoutes.js";
import pettyCashRoutes from "./src/routes/pettyCashRoutes.js"
import productRoutes from "./src/routes/productRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
//import orderRoutes from "./src/routes/orderRoutes.js";
import { validateAuthToken } from "./src/middlewares/validateAuthToken.js";

//import employeesRoutes from "./routes/employees.js";
//import swaggerUi from "swagger-ui-express";
//import fs from "fs";
//import path from "path";

// Creo una constante que es igual a la libreria que acabo de importar, y la ejecuto 

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.get('/api/status', (req, res) => {
    res.status(200).json({ message: 'Servidor en línea ✅' })
})

app.use("/api/employees", employeesRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/inventory", validateAuthToken(['admin', 'employee']), inventoryRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);       
app.use("/api/registerCustomer", registerCustomerRoutes);
app.use("/api/pettyCash", validateAuthToken(['admin', 'employee']), pettyCashRoutes); 
app.use("/api/registerEmployee", registerEmployeeRoutes);
app.use("/api/passwordRecovery", passwordRecoveryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
//app.use("/api/orders", orderRoutes);

//Exporto esta constante para usar express en todos lados
export default app;