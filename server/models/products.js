const mongoose = require(`mongoose`)

let productsSchema = new mongoose.Schema(
    {
        category: {type: String, required:true},
        brand: {type: String, required:true},
        model: {type: String, required:true},
        description: {type: String, required:true},
        colour: {type: String},
        release_date: {type: Date, required:true},
        energy_rating: {type: String, required:true},
        price: {type: Number, required:true},
        status: {type: Boolean, default: true, required:true},
        image: {type: String, default: ""},
        stocking_status: {type: String, default: "In Stock", required:true},
        stock_level: {type: Number, default: 0, required:true}
    },
    {
        collection: `products`
    })

module.exports = mongoose.model(`products`, productsSchema)