import express from "express";
import router from "../src/routes/products.routes.js";
import router2 from "../src/routes/carts.routes.js";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars"
import { Server } from "socket.io";
const PUERTO = 3000;
const WSPUERTO = 8080;

const server = express();
const httpServer = server.listen(WSPUERTO, () =>{
    console.log(`Servidor socketio activo en ${WSPUERTO}`);
})
const io = new Server(httpServer, {cors: {origin: "http://localhost:3000"}});
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use("/api",router);
server.use("/api",router2);
server.use("/public", express.static(`${__dirname}/public`));


server.engine("handlebars", engine());
server.set("view engine", "handlebars");
server.set("views", `${__dirname}/views`) // ver esta ruta

server.listen(PUERTO, () =>{
    console.log(`servidor express activo ${PUERTO}`);
})

io.on("connection", (socket) =>{
    console.log(`Nuevo cliente conectado (${socket.id})`);
    socket.emit("server_confirm","conexion recibida");
    socket.on("disconnect", (reason) =>{
        console.log(`Cliente desconectado (${socket.id}) : ${reason}`);
    // socket.on("event_c101", (data) => {
    //     console.log(data);
    // })    
    // socket.emit("event_c101", "Cliente intentando conectarse");
    });
    socket.on("new_message", (data)=>{
        console.log(data);
        io.emit("msg_received",data);
    });
})