import mongoose from "mongoose";
mongoose.pluralize(null);
const collection = "carts";

const schema = new mongoose.Schema({
    id: {type:Number, index:true},
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'products',
      },
});

const cartModel = mongoose.model(collection,schema);
export default cartModel;
