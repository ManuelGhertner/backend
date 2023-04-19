const express = require ("express");
const router = require ("../routes/products.routes");
const router2 = require ("../routes/carts.routes");
// const data = require ("../products.json");
const PUERTO = 8080;

const server = express();
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use("/api",router);
server.use("/api",router2);

server.listen(PUERTO, () =>{
    console.log("servidor express activo");
})