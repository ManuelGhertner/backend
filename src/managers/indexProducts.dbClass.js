import mongoose from "mongoose";
import productModel from "./products.model.js"
class Products {
    static newCode = 0;
    static newId = 0;
    constructor(){
        this.status = 0;
        this.statusMsg = "Iniciado";

    }
    static requiredFields = ["description", "title", "price", "stock","thumbnail", "status"]
    static #verifyRequiredFields = (obj) => {
        return Products.requiredFields.every(field => Object.prototype.hasOwnProperty.call(obj, field) && obj[field] !== null);
    };
    static #objEmpty (obj){
        return Object.keys(obj).length === 0;
    };
    checkStatus = () =>{
        return this.status;
    };

    showStatusMsg = () =>{
        return this.statusMsg;
    };
    addProduct = async (product) =>{
        Products.newCode++;
        Products.newId++;
        try{
            if(!Products.#objEmpty(product) && Products.#verifyRequiredFields(product)){
            
                await productModel.create({...product, id: Products.newId});
                this.status = 1;
                this.statusMsg = "Producto registrado en la base de datos";
            } else {
                this.status = -1;
                this.statusMsg = `Campos obligatorios incompletos (${Products.requiredFields.join(", ")})`;
            }
        } catch (err) {
            this.status = -1;
            this.statusMsg = `addProduct: ${err}`;
        }
    };
    getProducts = async () =>{
        try{
            const products = await productModel.find();
            this.status = 1;
            return products;
        } catch (err){
            this.status = -1;
            this.statusMsg = `getProducts: ${err}`;
        }
    };
    getProductById = async (id) =>{
        try{
            const product = productModel.findById(id);
            this.status = 1;
            return product;
        } catch (err){
            this.status = -1;
            this.statusMsg = `getProductById : ${err}`
        }
    };
    updateProduct = async (id, data) =>{
        try{
            if(data === undefined || Object.keys(data).length === 0){
                this.status = -1;
                this.statusMsg = "Faltan campos";
            } else{
                const updater = await productModel.updateOne({"_id": new mongoose.Types.ObjectId(id)}, data);
                this.status = 1;
                updater.modifiedCount === 0 ? this.statusMsg = "El ID no existe o no se registran cambios por realizar" : this.statusMsg = "Prodcuto actualizado"; 
            }
        } catch (err){
            this.status = -1;
            this.statusMsg = `updateProduct: ${err}`;
        }
    };
    deleteProduct = async (id) =>{
        try{
            const eliminador = await productModel.deleteOne({"_id": new mongoose.Types.ObjectId(id)});
            this.status = 1;
            eliminador.deletedCount === 0 ? this.statusMsg = "El ID no existe" : this.statusMsg = "Producto eliminado";
        } catch (err){
            this.status = -1;
            this.statusMsg = `deleteProduct: ${err}`
        }
    };
}

export default Products;