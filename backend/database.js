//importar la libreria mongoose 
import mongoose from "mongoose";
import { config } from "./src/config.js";

//Guardo en una constante la url de mi base de datos


mongoose.connect(config.db.URI);

// --------------------------------- comprobar que todo funcione


//Creo una constante que es igual a la conexión 
const connection = mongoose.connection;

connection.once("open", () => {
    console.log("DB is connected");
});

connection.on("disconnected", () => {
    console.log("DB is disconnected");
});

//veo si hay un error
connection.on("error", (error) => {
    console.log("error found + error");
});

