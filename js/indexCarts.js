const { log } = require("console");
const fs = require("fs");

class CartManager {
    static idUnico = 100;
    constructor(path) {
      this.carts = [];
      this.path = path;
    }
    addCart = async () =>{
      CartManager.idUnico++;
      const cart = {
        id: CartManager.idUnico,
        products: []
      }
      this.carts.push(cart);
      this.idUnico++;
      await fs.writeFile("carts.json", JSON.stringify(this.carts), err =>{
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
  }
  
  module.exports = CartManager;
  