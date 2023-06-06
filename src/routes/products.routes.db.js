import {Router} from "express";
import Products from "../managers/products/indexProducts.dbClass.js";
import productModel from "../managers/products/products.model.js";
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

routerDb.get("/products/:pid?", async (req, res) => {
    try {
        const page = req.params.pid || 1;
        const options = {
            limit: 3,
            page: page
        };

        const products = await productModel.paginate({}, options);

        const prevLink = products.hasPrevPage ? `/api/products/${products.prevPage}` : null;
        const nextLink = products.hasNextPage ? `/api/products/${products.nextPage}` : null;

        // res.status(200).send({
        //     status: 'OK',
        //     data: products,
        //     prevLink: prevLink,
        //     nextLink: nextLink
        // });
        res.render("products", {
            products: products.docs.map(product => product.toObject()),
            prevLink: prevLink,
            nextLink: nextLink
          });
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
});



routerDb.get("/products/sort/:sid?", async (req, res) => {
    try {
        const process = await productModel.find().sort({price: req.params.sid});
        res.status(200).send({ status: 'OK', data: process });
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
});

routerDb.get("/products/limit/:lid?", async (req, res) => {
    try {
        let process;
        if(req.params.lid){
            process = await productModel.find().limit(req.params.lid);
        } else{
            process = await productModel.find().limit(10);
        };
       
        res.status(200).send({ status: 'OK', data: process });
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
});
routerDb.get("/products/query/:qid?", async (req, res) => {
    try {
        const productId = req.params.qid; 
        const product = await productModel.findById(productId); 

        if (!product) {
            res.status(404).send({ status: 'ERR', message: 'Producto no encontrado' });
            return;
        }

        if (product.stock >= 1) {
            res.status(200).send({ status: 'OK', message: 'Hay disponibilidad', quantity: product.stock });
        } else {
            res.status(200).send({ status: 'OK', message: 'No hay disponibilidad' });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
});

routerDb.get("/products/query/category/:qcid?", async (req, res) => {
    try {
        const categoryId = req.params.qcid;

        const query = { category: categoryId };

        const products = await productModel.paginate(query, {limit:2, page: 1});

        if (products.length === 0) {
            res.status(404).send({ status: 'ERR', message: 'No se encontraron productos en la categoría especificada' });
            return;
        }

        res.status(200).send({ status: 'OK', data: products });
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
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

// cookies prueba

routerDb.get("/setcookie", (req, res) =>{
    try{
        res.cookie("Cookie1", "esta es una cookie", {maxAge: 60000})
        res.status(200).send({ status: "OK", data: "Cookie generada"});
    } catch (err){
        res.status(500).send({status: "ERR", error: err.message});
    }

})

export default routerDb;