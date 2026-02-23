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
        image: {type: String, default: ""}
    },
    {
        collection: `products`
    })

module.exports = mongoose.model(`products`, productsSchema)