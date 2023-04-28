const express = require("express");

const data = require("../products.json");
const CartManager = require ("../js/indexCarts")
const router = express.Router();


const cartManager = new CartManager("../js/carts.json");

router.post("/carts", async (req, res) => {
  const {products} = req.body;
  try{
    const cart = await cartManager.addCart(products);
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
})


module.exports = router;


// let idUnico = carts.length + 101;

// router.get("/carts", (req, res) => {
//   res.status(200).json(carts);
// });

// router.post("/carts", (req, res) => {
//   const cart = {
//     id: idUnico,
//     products: [],
//   };
//   carts.push(cart);
//   idUnico++;
//   fs.writeFileSync("carrito.json", JSON.stringify(carts));
//   res.status(201).send(carts);
// });

// router.post("/:cid/product/:pid", (req, res) => {
//   const cartId = parseInt(req.params.cid);
//   const cart = carts.find((cart) => cart.id === cartId);
//   if (!cart) {
//     return res.status(404).send("No existe el carrito");
//   } else {
//     const productId = parseInt(req.params.pid);
//     const productIndex = cart.products.findIndex(
//       (p) => p.product === productId
//     );
//     if (productIndex === -1) {
//       const product = data.find((p) => p.id === productId);
//       if (!product) {
//         return res.status(404).send("No existe el producto");
//       } else {
//         const quantity = 1;
//         const productoAgregado = { product: product.id, quantity: quantity };
//         cart.products.push(productoAgregado);
//         res.status(200).send({ status: "OK", mensaje: "producto agregado" });
//       }
//     } else {
//       cart.products[productIndex].quantity += 1;
//       res
//         .status(200)
//         .send({ status: "OK", mensaje: "Cantidad incrementada en 1" });
//     }
//   }
// });

// router.get("/:cid", (req, res) => {
//   const cartId = parseInt(req.params.cid);
//   const cart = carts.find((cart) => cart.id === cartId);
//   if (!cart) {
//     return res.status(404).send("No existe el carrito");
//   } else {
//     const products = cart.products;
//     res.status(200).json(products);
//   }
// });


