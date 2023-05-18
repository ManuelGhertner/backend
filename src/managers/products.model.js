import mongoose from "mongoose";

const collection = "products";

const schema = new mongoose.Schema({
id: Number,
title: {type: String, required: true},
description: String,
price: Number,
status: String, //verificar
thumbnail: String,
code: String,
stock: Number
});

const productModel = mongoose.model(collection,schema);
export default productModel;
