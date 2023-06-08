import {Router} from "express";
const router = Router();
import ProductManager from "../../managers/products/indexProducts.js";
console.log(process.cwd());
const productManager = new ProductManager("../src/storage/products.json");

router.get("/products", async (req, res) => {

try {
 const products = await productManager.getProducts();
//  console.log(products);
  res.render("index", {products});
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
  const { title, description, price, thumbnail, stock, status } = req.body;
  try {
    await productManager.addProduct(title, description, price, thumbnail, stock, status);
    res.status(200).send({ status: 'OK', mensaje: 'producto agregado' });
  } catch (error) {
    res.status(400).send({ status: 'error', mensaje: 'No se pudo agregar el producto' });
  }
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
  });

router.delete("/products/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);

try {
  await productManager.deleteProduct(id);
  res.status(200).send("Producto eliminado");
} catch (error){
  res.status(404).send("Producto no encontrado");
}

});




export default router;


  