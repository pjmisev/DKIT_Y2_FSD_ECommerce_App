const mongoose = require(`mongoose`)
const {productsSchema} = require('./products')

let ordersSchema = new mongoose.Schema(
    {
        fname: {type: String, required:true},
        lname: {type: String, required:true},
        email: {type: String, required:true},
        phone: {type: String, required:true},
        total_gross: {type: Number, required:true},
        delivery_cost: {type: Number, required:true},
        total_net: {type: Number, required:true},
        address_line_1: {type: String, required:true},
        address_line_2: {type: String},
        postcode: {type: String, required:true},
        county: {type: String, required:true},
        country: {type: String, required:true},
        products: [productsSchema],
        status: {type: String, default: "Pending", required:true},
        paypalPaymentID: {type: String},
        paypalPayerID: {type: String},
        creator_id: {type: String, required:true}
    },
    {
        collection: `orders`
    })

module.exports = mongoose.model(`orders`, ordersSchema)