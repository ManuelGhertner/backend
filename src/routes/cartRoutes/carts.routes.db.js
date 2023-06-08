
import {Router} from "express";
import Carts from "../../managers/carts/indexCarts.dbClass.js";
const routerDbcarts = Router();
const manager = new Carts();

routerDbcarts.post("/carts", async (req, res) => {
  try{
        await manager.addCart(req.body);
        if(manager.checkStatus() === 1){
            res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
        } else {
            res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
        }
  } catch (err){
    res.status(500).send({ status: 'ERR', error: err });
  }
 
});
routerDbcarts.post("/carts/:cid/product/:pid", async (req, res) => {
  const cartId = (req.params.cid);
  const productId = (req.params.pid);
  try {
    await manager.addProductToCart(cartId, productId);
    res.status(200).send({ status: 'OK', message: manager.showStatusMsg() });
  } catch (error) {
    res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
  }
});


routerDbcarts.get("/carts", async (req, res) => {
  try{
    const carts = await manager.getCarts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({error : error.message})
  }
});

routerDbcarts.delete("/carts/:id", async (req, res) => {
    try {
        await manager.deleteCarts(req.params.id);
    
        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
        } else {
            res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
});

routerDbcarts.get("/carts/:cid", async (req, res)=>{
    try {
        const cartId = req.params.cid;
        const carts = await manager.getCartsById(cartId);
        res.render("carts",{carts})
    } catch (err) {
        res.status(500).send({ status: 'err', error: err });
    }
});

routerDbcarts.delete("/carts/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const result = await manager.deleteProductFromCart(cartId, productId);

    if (result.status === "OK") {
      res.status(200).send({ status: "OK", message: result.message });
    } else {
      res.status(400).send({ status: "ERROR", message: result.message });
    }
  } catch (error) {
    res.status(500).send({ status: "ERROR", error: error.message });
  }
});

routerDbcarts.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    
    const result = await manager.deleteAllProductsFromCart(cartId);

    if (result.status === "OK") {
      res.status(200).json({ status: "OK", message: result.message });
    } else {
      res.status(400).json({ status: "ERROR", message: result.message });
    }
  } catch (error) {
    res.status(500).json({ status: "ERROR", error: error.message });
  }
});
routerDbcarts.put("/carts/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    const actualizacionExitosa = await manager.updateQuantity(cartId, productId, newQuantity);

    if (actualizacionExitosa) {
      res.status(200).json({ message: "Cantidad actualizada correctamente" });
    } else {
      res.status(500).json({ message: "Error al actualizar la cantidad" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la cantidad", error });
  }
});

routerDbcarts.put("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const newProducts = req.body.products;

    const updatedCart = await manager.updateCart(cartId, newProducts);

    if (updatedCart) {
      res.status(200).json({ message: "Carrito actualizado correctamente" });
    } else {
      res.status(404).json({ message: "No se encontró el carrito" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el carrito", error });
  }
});
export default routerDbcarts;


