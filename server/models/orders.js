const mongoose = require(`mongoose`)

let ordersSchema = new mongoose.Schema(
    {
        total_gross: {type: Number},
        vat: {type: Number},
        delivery_cost: {type: Number},
        total_net: {type: Number},
        address_line_1: {type: String},
        address_line_2: {type: String},
        postcode: {type: String},
        county: {type: String},
        country: {type: String},
        products: {type: Array, default: []},
        status: {type: String, default: "Pending"},
    },
    {
        collection: `orders`
    })

module.exports = mongoose.model(`orders`, ordersSchema)