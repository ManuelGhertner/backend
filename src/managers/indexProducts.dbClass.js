import mongoose from "mongoose";
import productModel from "./products.model";
class Products {
    constructor(){

    }
    static requiredFields = ["description", "title", "price", "stock","thumbnail", "status"]
    static #verifyRequiredFields = (obj) => {
        return Products.requiredFields.every(field => Object.prototype.hasOwnProperty.call(obj, field) && obj[field] !== null);
    }
    getProducts = async () =>{
        try{
            const products = await productModel.find();
            return products;
        } catch (err){
            console.log("No se pudo cargar los productos");
        }
    }
}

export default Products;