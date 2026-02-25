const mongoose = require(`mongoose`)

let productsSchema = new mongoose.Schema(
    {
        category: {type: String},
        brand: {type: String},
        model: {type: String},
        description: {type: String},
        colour: {type: String},
        release_date: {type: Date},
        energy_rating: {type: String},
        price: {type: Number},
        status: {type: Boolean},
        image: {type: String, default: ""},
        stocking_status: {type: String, default: "In Stock"},
        stock_level: {type: Number, default: 0}
    },
    {
        collection: `products`
    })

module.exports = mongoose.model(`products`, productsSchema)