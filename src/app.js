import {} from "dotenv/config";
import express from "express";
// import routerDb from "./routes/products.routes.db.js";
import router from "../src/routes/products.routes.js";
import router2 from "../src/routes/carts.routes.js";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
const PUERTO = parseInt(process.env.PORT) || 3000;
const MONGOOSE_URL = process.env.MONGOOSE_URL;
const WSPUERTO = 8080;

const server = express();
const httpServer = server.listen(WSPUERTO, () => {
  console.log(`Servidor socketio activo en ${WSPUERTO}`);
});
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    credentials: false,
  },
});
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use("/api", router);
server.use("/api", router2);
// server.use("/api", routerDb) //router para mongoose
server.use("/public", express.static(`${__dirname}/public`));

server.engine("handlebars", engine());
server.set("view engine", "handlebars");
server.set("views", `${__dirname}/views`);

try {
  await mongoose.connect(MONGOOSE_URL);//si pongo el .env como dice el profesor en el raiz, no funciona, funciona si lo pongo tal como esta

  server.listen(PUERTO, () => {
    console.log(`servidor express activo ${PUERTO}`);
  });
} catch (err) {
  console.log("No se puede conectar con el servidor de bbdd");
}

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado (${socket.id})`);
  socket.emit("server_confirm", "conexion recibida");
  socket.on("disconnect", (reason) => {
    console.log(`Cliente desconectado (${socket.id}) : ${reason}`);
  });
  socket.on("new_message", (data) => {
    console.log(data);
    io.emit("msg_received", data);
  });
});
