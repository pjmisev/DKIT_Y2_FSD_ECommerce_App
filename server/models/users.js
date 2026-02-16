const mongoose = require(`mongoose`)

let userSchema = new mongoose.Schema(
    {
        fname: {type: String},
        lname: {type: String},
        email: {type: String},
        password: {type: String},
        date_created: {type: Date}
    },
    {
        collection: `users`
    })

module.exports = mongoose.model(`users`, userSchema)