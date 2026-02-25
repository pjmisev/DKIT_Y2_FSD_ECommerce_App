const mongoose = require(`mongoose`)

let userSchema = new mongoose.Schema(
    {
        fname: {type: String},
        lname: {type: String},
        email: {type: String},
        password: {type: String},
        status: {type: Boolean},
        date_created: {type: Date, default: Date.now},
        accessLevel: {type: Number, default: 1} // 1 = Normal User, 2 = Admin
    },
    {
        collection: `users`
    })

module.exports = mongoose.model(`users`, userSchema)