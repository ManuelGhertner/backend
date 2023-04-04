const fs = require("fs");
class ProductManager {
  static newCode = 0;
  static newId = 0;
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  addProduct = async (title, description, price, thumbnail, stock) => {
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

    if (title && description && price && thumbnail && stock) {
      if (codeUnico) {
        const newProduct = {
          id: ProductManager.newId,
          title: title,
          description: description,
          price: price,
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
    if (product) {
      console.log(product);
      return product;
    } else {
      console.log("Not Found");
    }
  };
}
const adder = new ProductManager("./products.json");
adder.getProducts().then((products) => {
  console.log(products);
});

adder.addProduct("title", "description", 20, "thumbnail", 20);
adder.addProduct("title2", "description", 30, "thumbnail2", 30);
adder.addProduct("title3", 30, "thumbnail2", 30); // ejemplo campo faltante
adder.getProductById(1);
adder.updateProducts(1, {
  title: "titulo actualizado",
  description: "descripcion actualizada",
  price: 60,
  thumbnail: "thumbnail actualizado",
  stock: 89,
});
adder.getProductById(1);
adder.deleteProduct(1);
