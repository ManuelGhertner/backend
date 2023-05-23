import mongoose from "mongoose";
import cartModel from "./carts.model.js"
import productModel from "./products.model.js";
class Carts {
    static idUnico = 100;
    constructor() {
        this.status = 0;
        this.statusMsg = "Iniciado";
    }
    checkStatus = () =>{
        return this.status;
    };

    showStatusMsg = () =>{
        return this.statusMsg;
    };
    static #objEmpty (obj){
        return Object.keys(obj).length === 0;
    };
    addCart = async (cart) =>{
      Carts.idUnico++;
      try{
        if(!Carts.#objEmpty(cart)){
            await cartModel.create({...cart, id: Carts.idUnico});
            this.status = 1;
            this.statusMsg = "Carrito registrado en la base de datos";
        } else {
            this.status = -1;
            this.statusMsg = `Campos obligatorios incompletos`;
        }
        }  catch (err){
            this.status = -1;
            this.statusMsg = `addCart: ${err}`;
        }
    };
    getCarts = async () =>{
        try{
            const carts = await cartModel.find();
            this.status = 1;
            return carts;
        } catch (err){
            this.status = -1;
            this.statusMsg = `getCarts: ${err}`;
        }
    };
    deleteCarts = async (id) =>{
        try{
            const eliminador = await cartModel.deleteOne({"_id": new mongoose.Types.ObjectId(id)});
            this.status = 1;
            eliminador.deletedCount === 0 ? this.statusMsg = "El ID no existe" : this.statusMsg = "Carrito eliminado";
        } catch (err){
            this.status = -1;
            this.statusMsg = `deleteCarts: ${err}`
        }
    };
    getCartsById = async (cartId) =>{
        const cart = await cartModel.findOne({id: cartId});
        if (!cart) {
          return null;
        } else {
        //   const products = await cart.populate("products");
          return cart;
        }
      } 
    }


    // addProductToCart = async (cartId, productId) => {
    //     try {
    //         const cartData = await fs.promises.readFile(this.path, "utf-8");
    //         const carts = JSON.parse(cartData);
    //         const productData = await fs.promises.readFile("../products.json", "utf-8");
    //         const products = JSON.parse(productData);
    //         const cartIndex = carts.findIndex((carts) => carts.id === cartId);
    //         if (cartIndex === -1){
    //             return {status: "ERROR", mensaje: "El carrito no existe"};
    //         }
    //         const productIndex = products.findIndex((product) => product.id === productId);
    //         if (productIndex === -1){
    //             return {status: "ERROR", mensaje: "El producto no existe"};
    //         }
    //         const cart = carts[cartIndex];
    //         const cartProductIndex = cart.products.findIndex((product) => product.id === productId);
    //         if (cartProductIndex === -1){
    //             const cartProduct = {
    //                 id: productId,
    //                 quantity: 1,
    //             };
    //             cart.products.push(cartProduct);
    //             await fs.promises.writeFile (this.path, JSON.stringify(carts), "utf-8");
    //             await this.getCarts();
    //             return {status: "Ok", mensaje: "Producto agregado"};
    //         } else {
    //             const cartProduct = cart.products[cartProductIndex];
    //             cartProduct.quantity += 1 ;
    //             await fs.promises.writeFile(this.path,JSON.stringify(carts), "utf-8");
    //             await this.getCarts();  
    //             return { status: "OK", mensaje: "Cantidad incrementada en 1"};
    //         } 
            
        
    //         } catch (error) {
    //             console.log(error);
    //             throw error;
    //         }
    //   }




    //   try {
    //     const cart = await cartModel.findOne({id: cartId});
    //     if (!cart) {
    //       this.status = -1;
    //       this.statusMsg = `El carrito no existe`;
    //       };
    //     const product = await productModel.findOne({id: productId});
    //     if (!product) {
    //       this.status = -1;
    //       this.statusMsg = `El producto no existe`;
    //     };
    //     const cartProductIndex = cart.products.findIndex((product) => product.id === productId);
    //     if (cartProductIndex === -1) {
    //       const cartProduct = {
    //         _id: new mongoose.Types.ObjectId(), 
    //         id: productId,
    //         quantity: 1
    //       };
    //       cart.products.push(cartProduct);
    //     } else {
    //       const cartProduct = cart.products[cartProductIndex];
    //       cartProduct.quantity += 1;
    //     }
    
    //     await cartModel.findByIdAndUpdate(cart._id, { products: cart.products });
    //       this.status = 1
    //       this.statusMsg = "Producto agregado al carrito en la base de datos";
        
    //   } catch (err) {
    //       this.status = -1;
    //       this.statusMsg = `addProductToCart: ${err}`;
    //   }



//     getCarts = async () =>{
//         try {
//             const data = await fs.promises.readFile(this.path, "utf-8");
//             this.carts = JSON.parse(data);
//             return this.carts;
//         } catch (error){
//             console.log(error);
//             throw error;
//         }
//     }

//     getCartsById = async (cartId) =>{
//         const cart = this.carts.find((cart) => cart.id === cartId);
//         if(!cart){
//             return null;
//         } else {
//             const products = cart.products;
//             return products;
//         }

//     }
// addProductToCart = async (cartId, productId) => {

// try {
//     const cartData = await fs.promises.readFile(this.path, "utf-8");
//     const carts = JSON.parse(cartData);
//     const productData = await fs.promises.readFile("../products.json", "utf-8");
//     const products = JSON.parse(productData);
//     const cartIndex = carts.findIndex((carts) => carts.id === cartId);
//     if (cartIndex === -1){
//         return {status: "ERROR", mensaje: "El carrito no existe"};
//     }
//     const productIndex = products.findIndex((product) => product.id === productId);
//     if (productIndex === -1){
//         return {status: "ERROR", mensaje: "El producto no existe"};
//     }
//     const cart = carts[cartIndex];
//     const cartProductIndex = cart.products.findIndex((product) => product.id === productId);
//     if (cartProductIndex === -1){
//         const cartProduct = {
//             id: productId,
//             quantity: 1,
//         };
//         cart.products.push(cartProduct);
//         await fs.promises.writeFile (this.path, JSON.stringify(carts), "utf-8");
//         await this.getCarts();
//         return {status: "Ok", mensaje: "Producto agregado"};
//     } else {
//         const cartProduct = cart.products[cartProductIndex];
//         cartProduct.quantity += 1 ;
//         await fs.promises.writeFile(this.path,JSON.stringify(carts), "utf-8");
//         await this.getCarts();  
//         return { status: "OK", mensaje: "Cantidad incrementada en 1"};
//     } 
    

//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }   



  


export default Carts;
  