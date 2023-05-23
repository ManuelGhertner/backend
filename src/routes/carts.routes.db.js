
import {Router} from "express";
import Carts from "../managers/indexCarts.dbClass.js";
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
routerDbcarts.post ("/:cid/product/:pid", async (req, res) =>{
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  try{
    await manager.addProductToCart(cartId, productId);
    res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
  }catch (error){
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

routerDbcarts.get("/:cid", async (req, res)=>{
    try {
        const cartId = parseInt(req.params.cid);
        const carts = await manager.getCartsById(cartId);
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).send({ status: 'err', error: err });
    }
});



export default routerDbcarts;


