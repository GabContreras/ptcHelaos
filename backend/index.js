//Importo el archivo app.js

import app from "./app.js";
import "./database.js";
import { config } from "./src/config.js";

//Creo una función que ejecuta el servidor 

async function main() {
    app.listen(config.server.port)

    console.log("Sorbetes en el puerto:" + config.server.port);
}
//Ejecuto la función 
main();