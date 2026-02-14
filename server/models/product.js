const mongoose = require(`mongoose`)

let productSchema = new mongoose.Schema(
    {
        category: {type: String},
        brand: {type: String},
        model: {type: String},
        description: {type: String},
        colour: {type: String},
        release_date: {type: Date},
        energy_rating: {type: String},
        price: {type: Number}
    },
    {
        collection: `products`
    })

module.exports = mongoose.model(`products`, productSchema)