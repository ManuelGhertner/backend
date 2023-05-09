import express from "express";
import router from "../routes/products.routes.js";
import router2 from "../routes/carts.routes.js";
import { __dirname } from "../utils.js";
import { engine } from "express-handlebars"
import { Server } from "socket.io";
const PUERTO = 3000;
const WSPUERTO = 8080;

const server = express();
const httpServer = server.listen(WSPUERTO, () =>{
    console.log(`Servidor socketio activo en ${WSPUERTO}`);
})
const wss = new Server(httpServer);
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use("/api",router);
server.use("/api",router2);
server.use("/public", express.static(`${__dirname}/public`));


server.engine("handlebars", engine());
server.set("view engine", "handlebars");
server.set("views", "../views") // ver esta ruta

wss.on("connection", (socket) =>{
    console.log("Nuevo cliente conectado");
    // socket.on("message", (data) =>{
    //     console.log(data);
    //     socket.emit("confirm", "conexion de cliente recibida")
    // })
})

server.listen(PUERTO, () =>{
    console.log(`servidor express activo ${PUERTO}`);
})