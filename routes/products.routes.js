const express = require("express");
const data = require("../products.json");
const router = express.Router();
const ProductManager = require ("../js/index")

const productManager = new ProductManager("../products.json");

// let idUnico = data.length + 1;
// const requeridos = [
//   "title",
//   "description",
//   "code",
//   "price",
//   "status",
//   "stock",
//   "thumbnail",
// ];
router.get("/products", async (req, res) => {

try {
 const products = await productManager.getProducts();
//  console.log(products);
  res.status(200).send(products);
}catch (error){
   res.status(500).send("Internal server error");
}


});

router.get("/products/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  try {
   
    const producto = await productManager.getProductById(id);
 
    if (producto) {

      res.status(200).send(producto);
    } else {
      res.status(404).send("Producto no encontrado");
    } 
  }catch (error){
    res.status(500).send("Internal server error 2");
  }

});

router.post("/products", async (req, res) => {
  const { title, description, price, thumbnail, stock } = req.body;
  try {
    await productManager.addProduct(title, description, price, thumbnail, stock);
    res.status(200).send({ status: 'OK', mensaje: 'producto agregado' });
  } catch (error) {
    res.status(400).send({ status: 'error', mensaje: 'No se pudo agregar el producto' });
  }
  // const newProduct = req.body;
  // const verificarCampos = (newProduct, obligatorios) => {
  //   const keys = Object.keys(newProduct);
  //   return obligatorios.every((val) => keys.includes(val));
  // };

  // if (verificarCampos(newProduct, requeridos)) {
  //   newProduct.id = idUnico;
  //   data.push(newProduct);
  //   idUnico++;
  //   res.status(200).send({ status: "OK", mensaje: "producto agregado" });
  // } else {
  //   res
  //     .status(400)
  //     .send({ status: "error", mensaje: "Faltan campos obligatorios" });
  // }
}),
  router.put("/products/:pid", async(req, res) => {
    const id = parseInt(req.params.pid);
    const updates = req.body;

    try {
      const updatedProduct = await productManager.updateProducts(id,updates);
      if (updatedProduct){
        res.status(200).send(updatedProduct);
      } else{
        res.status(404).send("Producto no encontrado");
      }
    } catch (error){
      res.status(500).send("Internal server error 3")
    }





    // const index = data.findIndex((product) => product.id === id);

    // if (index !== -1) {
    //   const product = data[index];
    //   const updatedProduct = { ...product, ...req.body, id: product.id };
    //   data[index] = updatedProduct;
    //   res.status(200).send(updatedProduct);
    // } else {
    //   res.status(404).send("Producto no encontrado");
    // }
  });

router.delete("/products/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);

try {
  await productManager.deleteProduct(id);
  res.status(200).send("Producto eliminado");
} catch (error){
  res.status(404).send("Producto no encontrado");
}



  // const index = data.findIndex((product) => product.id === id);

  // if (index !== -1) {
  //   data.splice(index, 1);
  //   res.status(200).send("Producto eliminado");
  // } else {
  //   res.status(404).send("Producto no encontrado");
  // }
});

module.exports = router;


  // const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  // const products = limit ? data.slice(0, limit) : data;

  