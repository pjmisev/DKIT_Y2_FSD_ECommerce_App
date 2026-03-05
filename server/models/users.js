const mongoose = require(`mongoose`)

let userSchema = new mongoose.Schema(
    {
        fname: {type: String, required:true},
        lname: {type: String, required:true},
        email: {type: String, required:true},
        phone: {type: String},
        password: {type: String, required:true},
        address_line_1: {type: String},
        address_line_2: {type: String},
        postcode: {type: String},
        county: {type: String},
        country: {type: String},
        status: {type: Boolean, default: true, required:true},
        date_created: {type: Date, default: Date.now, required:true},
        accessLevel: {type: Number, default: 1, required:true}, // 1 = Normal User, 2 = Admin
        image: {type: String, default: ""}
    },
    {
        collection: `users`
    })

module.exports = mongoose.model(`users`, userSchema)