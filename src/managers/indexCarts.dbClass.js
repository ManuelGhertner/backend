import mongoose from "mongoose";
import cartModel from "./carts.model.js";
import productModel from "./products.model.js";
class Carts {
  static idUnico = 100;
  constructor() {
    this.status = 0;
    this.statusMsg = "Iniciado";
  }
  checkStatus = () => {
    return this.status;
  };

  showStatusMsg = () => {
    return this.statusMsg;
  };
  static #objEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  addCart = async (cart) => {
    Carts.idUnico++;
    try {
      if (!Carts.#objEmpty(cart)) {
        await cartModel.create({ ...cart, id: Carts.idUnico });
        this.status = 1;
        this.statusMsg = "Carrito registrado en la base de datos";
      } else {
        this.status = -1;
        this.statusMsg = `Campos obligatorios incompletos`;
      }
    } catch (err) {
      this.status = -1;
      this.statusMsg = `addCart: ${err}`;
    }
  };
  getCarts = async () => {
    try {
      const carts = await cartModel.find().populate('products.idProduct');
      this.status = 1;
      return carts;
    } catch (err) {
      this.status = -1;
      this.statusMsg = `getCarts: ${err}`;
    }
  };
  deleteCarts = async (id) => {
    try {
      const eliminador = await cartModel.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });
      this.status = 1;
      eliminador.deletedCount === 0
        ? (this.statusMsg = "El ID no existe")
        : (this.statusMsg = "Carrito eliminado");
    } catch (err) {
      this.status = -1;
      this.statusMsg = `deleteCarts: ${err}`;
    }
  };
  getCartsById = async (cartId) => {
    const cart = await cartModel.findById(cartId).populate("products.idProduct");
    if (!cart) {
      return null;
    } else {
      return cart;
    }
  };
//   


addProductToCart = async (cartId, productId) => {
  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return { status: "ERROR", message: "El producto no existe" };
    }

    const cart = await cartModel.findById(cartId)
    let flag = false
    cart.products.forEach( async p => {
      if (p.idProduct.toString() === productId && !flag) {
      p.quantity++
      flag = true
      await cart.save()
    }
  })
  if(flag){
    return { status: "OK", message: "Aumento de cantidad" }
  }

    cart.products.push({idProduct: productId})

    await cart.save()
    return { status: "OK", message: "Producto agregado al carrito" };
  } catch (error) {
    throw error;
  }
};

  deleteAllProductsFromCart = async (cartId) => {
    try {
      const cart = await cartModel.findByIdAndUpdate(cartId, { products: [] });
  
      if (!cart) {
        return { status: "ERROR", message: "El carrito no existe" };
      }
  
      return { status: "OK", message: "Todos los productos eliminados del carrito" };
    } catch (error) {
      throw error;
    }
  };
}

export default Carts;
