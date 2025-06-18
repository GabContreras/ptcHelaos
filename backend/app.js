//funciones de la app, tipo login, crud, registros, etc

//inserto todo lo de la libreria express
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { validateAuthToken } from "./src/middlewares/validateAuthToken.js";

//import employeesRoutes from "./routes/employees.js";
//import swaggerUi from "swagger-ui-express";
//import fs from "fs";
//import path from "path";

// Creo una constante que es igual a la libreria que acabo de importar, y la ejecuto 

const app = express();

//Middleware para que acepte datos JSON
app.use(express.json());
//Que acepte cookies en postman
app.use(cookieParser());

//app.use("/api/employees/", employeesRoutes);


//Exporto esta constante para usar express en todos lados
export default app;
