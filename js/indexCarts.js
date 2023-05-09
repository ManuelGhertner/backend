
// const fs = require("fs");
import fs from "fs";
class CartManager {
    static idUnico = 100;
    constructor(path) {
      this.carts = [];
      this.path = path;
      this.data =[];
    }
    addCart = async () =>{
      CartManager.idUnico++;
      const cart = {
        id: CartManager.idUnico,
        products: []
      }
      this.carts.push(cart);
      this.idUnico++;
      await fs.promises.writeFile("carts.json", JSON.stringify(this.carts), err =>{
        if (err) throw err;
        console.log("Se actualizaron los carritos");
      });
      return cart;
    }

    getCarts = async () =>{
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            return this.carts;
        } catch (error){
            console.log(error);
            throw error;
        }
    }

    getCartsById = async (cartId) =>{
        const cart = this.carts.find((cart) => cart.id === cartId);
        if(!cart){
            return null;
        } else {
            const products = cart.products;
            return products;
        }

    }
addProductToCart = async (cartId, productId) => {

try {
    const cartData = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(cartData);
    const productData = await fs.promises.readFile("../products.json", "utf-8");
    const products = JSON.parse(productData);
    const cartIndex = carts.findIndex((carts) => carts.id === cartId);
    if (cartIndex === -1){
        return {status: "ERROR", mensaje: "El carrito no existe"};
    }
    const productIndex = products.findIndex((product) => product.id === productId);
    if (productIndex === -1){
        return {status: "ERROR", mensaje: "El producto no existe"};
    }
    const cart = carts[cartIndex];
    const cartProductIndex = cart.products.findIndex((product) => product.id === productId);
    if (cartProductIndex === -1){
        const cartProduct = {
            id: productId,
            quantity: 1,
        };
        cart.products.push(cartProduct);
        await fs.promises.writeFile (this.path, JSON.stringify(carts), "utf-8");
        await this.getCarts();
        return {status: "Ok", mensaje: "Producto agregado"};
    } else {
        const cartProduct = cart.products[cartProductIndex];
        cartProduct.quantity += 1 ;
        await fs.promises.writeFile(this.path,JSON.stringify(carts), "utf-8");
        await this.getCarts();  
        return { status: "OK", mensaje: "Cantidad incrementada en 1"};
    } 
    

    } catch (error) {
        console.log(error);
        throw error;
    }
}   



  
}

export default CartManager;
  
//   module.exports = CartManager;
  

    // try {
    //     const data = await fs.promises.readFile(this.path, "utf-8");
    //     this.carts = JSON.parse(data);
    //     const cart = this.carts.find((cart) => cart.id === cartId);
    //     if(!cart){
    //         return null;
    //     };
    //     const productIndex = cart.products.findIndex((p) => p.product === productId);
    //     if (productIndex === -1) {
    //         const product = this.data.find((p) => p.id === productId);
    //         if(!product){
    //             return null;
    //         } else {
    //             const quantity = 1;
    //             const productoAgregado = {product: product.id, quantity: quantity};
    //             cart.products.push(productoAgregado);
    //             await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
    //             return {status: "OK", mensaje: "Producto Agregado"};
    //         } 

    //     } else {
    //         cart.products[productIndex].quantity +=1;
    //         await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
    //         return { status: "OK", mensaje: "Cantidad incrementada en 1"};
    //     }
    // } catch (error){
    //     console.log(error); 
    //     throw error;
    // }