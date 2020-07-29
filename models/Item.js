const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        default : 0
    }, 
    ownerIds : {
        type : String,
        required : true
    },
    dateAdded : {
        type : Date,
        default : Date.now
    }
});

const Item = new mongoose.model('Item', ItemSchema);

module.exports = {
    ItemSchema,
    Item
}