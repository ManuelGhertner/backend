
import {Router} from "express";

import CartManager from "../../managers/carts/indexCarts.js";
const router = Router();


const cartManager = new CartManager("../src/storage/carts.json");

router.post("/carts", async (req, res) => {
  const {products} = req.body;
  try{
    const cart = await cartManager.addCart();
    res.status(201).send(cart);
  } catch (error){
    console.log(error);
    res.status(400).send({ status: 'error', mensaje: 'No se pudo agregar el carrito' });
  }
 
});

router.get("/carts", async (req, res) => {
  try{
    const carts = await cartManager.getCarts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({error : error.message})
  }
});

router.get("/:cid", async (req, res)=>{
  try {
    const cartId = parseInt(req.params.cid);
    const products = await cartManager.getCartsById(cartId);
    if (!products) {
      return res.status(404).send("No existe el carrito");
    } else {
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).send("Internal server error, 5")
  }
});

router.post ("/:cid/product/:pid", async (req, res) =>{
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  try{
    const result = await cartManager.addProductToCart(cartId, productId);
    res.status(200).json(result);
  }catch (error){
    res.status(400).send(error.message)
  }
});


export default router;



