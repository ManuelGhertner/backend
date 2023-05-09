// const fs = require("fs");
import fs from "fs";
class ProductManager {
  static newCode = 0;
  static newId = 0;
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  addProduct = async (title, description, price, thumbnail, stock, status) => {
    ProductManager.newCode++;
    ProductManager.newId++;
    let newCode = ProductManager.newCode;
    let codeUnico = true;
    this.products.forEach((product) => {
      if (product.code === newCode) {
        codeUnico = false;
        console.log("el code ya existe");
      }
    });

    if (title && description && price && thumbnail && stock && status) {
      if (codeUnico) {
        const newProduct = {
          id: parseInt(ProductManager.newId),
          title: title,
          description: description,
          price: price,
          status: status,
          thumbnail: thumbnail,
          code: `CODE${ProductManager.newCode}`,
          stock: stock,
        };

        this.products.push(newProduct);
        const arregloArchivos = JSON.stringify(this.products);
        await fs.promises.writeFile(this.path, arregloArchivos);
      }
    } else {
      console.log("Debes completar todos los campos");
    }
  };

  deleteProduct = async (id) => {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      console.log(products);
      const index = this.products.findIndex((product) => product.id === id);
      if (index === -1) {
        console.log(`el id ${id} no fue encontrado`);
        return;
      }
      products.splice(index, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      console.log(`el producto con id ${id} fue eliminado`);
    } catch (err) {
      console.log(err);
    }
  };

  getProducts = async () => {
    const products = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(products);
  };

  updateProducts = async (id, updates) => {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      const update = {
        ...this.products[index],
        ...updates,
        id: id,
      };
      this.products[index] = update;
      await fs.promises.writeFile(this.path, JSON.stringify(this.products));
      return update;
    } else {
      console.log("ID para actualizar producto no encontrado");
      return null;
    }
  };

  getProductById = async (id) => {
    const product = this.products.find((product) => product.id === id);
    console.log(product);
    if (product) {
      // console.log(product);
      return product;
    } else {
      return null;
      console.log("Not Found");
    }
  };
}
// const adder = new ProductManager("../products.json");
// adder.getProducts().then((products) => {
//   console.log(products);
// });





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
























// adder.addProduct("title", "description", 20, "thumbnail", 20);
// adder.addProduct("title2", "description", 30, "thumbnail2", 30);
// adder.addProduct("title3", 30, "thumbnail2", 30); // ejemplo campo faltante
// adder.getProductById(1);
// adder.updateProducts(1, {
//   title: "titulo actualizado",
//   description: "descripcion actualizada",
//   price: 60,
//   thumbnail: "thumbnail actualizado",
//   stock: 89,
// });
// adder.getProductById(1);
// adder.deleteProduct(1);
export default ProductManager;
// module.exports = ProductManager;