const express = require("express");
const data = require("../products.json");
const router = express.Router();
let idUnico = data.length + 1;
const requeridos = [
  "title",
  "description",
  "code",
  "price",
  "status",
  "stock",
  "thumbnail",
];
router.get("/products", (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const products = limit ? data.slice(0, limit) : data;
  res.status(200).send(products);
});

router.get("/products/:pid", (req, res) => {
  const id = parseInt(req.params.pid);
  const product = data.find((product) => product.id === id);
  if (product) {
    res.status(200).send(product);
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

router.post("/products", (req, res) => {
  const newProduct = req.body;
  const verificarCampos = (newProduct, obligatorios) => {
    const keys = Object.keys(newProduct);
    return obligatorios.every((val) => keys.includes(val));
  };

  if (verificarCampos(newProduct, requeridos)) {
    newProduct.id = idUnico;
    data.push(newProduct);
    idUnico++;
    res.status(200).send({ status: "OK", mensaje: "producto agregado" });
  } else {
    res
      .status(400)
      .send({ status: "error", mensaje: "Faltan campos obligatorios" });
  }
}),
  router.put("/products/:pid", (req, res) => {
    const id = parseInt(req.params.pid);
    const index = data.findIndex((product) => product.id === id);

    if (index !== -1) {
      const product = data[index];
      const updatedProduct = { ...product, ...req.body, id: product.id };
      data[index] = updatedProduct;
      res.status(200).send(updatedProduct);
    } else {
      res.status(404).send("Producto no encontrado");
    }
  });

router.delete("/products/:pid", (req, res) => {
  const id = parseInt(req.params.pid);
  const index = data.findIndex((product) => product.id === id);

  if (index !== -1) {
    data.splice(index, 1);
    res.status(200).send("Producto eliminado");
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

module.exports = router;
