import mongoose from 'mongoose';

mongoose.pluralize(null);

const collection = 'users';

const schema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['F', 'M'], default: 'M'},
    role1: { type: String, enum: ['user', 'admin'], default: 'user'}, //verificar roles
    avatar: String
});

const userModel = mongoose.model(collection, schema);

export default userModel;