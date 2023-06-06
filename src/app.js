import {} from "dotenv/config";
import express from "express";
import routerDb from "./routes/products.routes.db.js";
import routerDbcarts from "./routes/carts.routes.db.js";
import routerDbusers from "./routes/users.routes.db.js";

// import router from "../src/routes/products.routes.js";
// import router2 from "../src/routes/carts.routes.js";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
// import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import userRoutes from "./routes/users.routes.db.js";
const PUERTO = parseInt(process.env.PORT) || 3000;
const MONGOOSE_URL = process.env.MONGOOSE_URL;
const COOKIE_SECRET = "CODIGOSECRETO";
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
server.use("/api", routerDb);
server.use("/api", routerDbcarts);
server.use("/api", routerDbusers(io));

server.use("/public", express.static(`${__dirname}/public`));
server.use(cookieParser());
// const fileStorage = FileStore(session);
// const store = new fileStorage ({path: `${__dirname}/sessions`, ttl: 3600, retries: 0});
const store = MongoStore.create({ mongoUrl: MONGOOSE_URL, mongoOptions: {}, ttl:60});
server.use(session({
  store : store,
  secret: COOKIE_SECRET,
  resave: false,
  saveUninitialized: false
}))
// server.use("/api", routerDbusers);
server.engine("handlebars", engine());
server.set("view engine", "handlebars");
server.set("views", `${__dirname}/views`);
// server.use("/products", routerDb)

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
