const { ItemSchema } = require('../Item');

module.exports = function (schema) {
    schema.add({
        role: String,
        shopName: String,
        items: [ItemSchema]
    });
}