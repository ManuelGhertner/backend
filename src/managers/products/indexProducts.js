import fs from "fs";
// import productModel from "./products.model";
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

      // const lastId = await productModel.findOne({},{id:1}).sort({id: -1});
      // await productModel.create({id: lastId.id + 1, ...product})
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
    // const products = await productModel.find();
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

      return product;
    } else {
      return null;
      console.log("Not Found");
    }
  };
}

export default ProductManager;
