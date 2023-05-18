import {Router} from "express";
import Products from "../managers/indexProducts.dbClass.js";
import router from "./products.routes";

const routerDb = Router();
const manager = new Products();

// const productRoutes = (io) =>{

routerDb.get("/products", async (req, res) => {

});

routerDb.post("/products", async (req, res) => {

});

routerDb.put("/products", async (req, res) => {

});

routerDb.delete("/products", async (req, res) => {

});

// }

export default routerDb;