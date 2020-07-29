const mongoose = require('mongoose');
mongoose.plugin(require('./plugins/Shopowner'));
mongoose.plugin(require('./plugins/Customer'));

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
});

const User = new mongoose.model('User', UserSchema);

module.exports = {
    User
};