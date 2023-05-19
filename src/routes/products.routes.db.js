import {Router} from "express";
import Products from "../managers/indexProducts.dbClass.js";
// import routerDb from "./products.routes";

const routerDb = Router();
const manager = new Products();

// const productRoutes = (io) =>{

routerDb.get("/products_index", async (req, res) => {
    const products = await manager.getProducts();
    res.render('products_index', {
        products: products
    });
});

routerDb.get("/products", async (req, res) => {
    try {
        const products = await manager.getProducts();
        res.status(200).send({ status: 'OK', data: products });
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
});

routerDb.post("/products", async (req, res) => {
    try {
        await manager.addProduct(req.body);

        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
        } else {
            res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
});

routerDb.put("/products/:id", async (req, res) => {
    try {
        await manager.updateProduct(req.params.id, req.body);
    
        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
        } else {
            res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
});

routerDb.delete("/products/:id", async (req, res) => {
    try {
        await manager.deleteProduct(req.params.id);
    
        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
        } else {
            res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
});

// }

export default routerDb;