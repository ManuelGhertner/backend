import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
mongoose.pluralize(null);
const collection = "products";

const schema = new mongoose.Schema({
id: {type:Number, index:true},
title: {type: String, required: true},
description: String,
price: Number,
status: String, //verificar
thumbnail: String,
code: String,
stock: Number,
category: String,
});
schema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection,schema);
export default productModel;
