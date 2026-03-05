const mongoose = require(`mongoose`)

let userSchema = new mongoose.Schema(
    {
        fname: {type: String, required:true},
        lname: {type: String, required:true},
        email: {type: String, required:true},
        password: {type: String, required:true},
        status: {type: Boolean, default: true, required:true},
        date_created: {type: Date, default: Date.now, required:true},
        accessLevel: {type: Number, default: 1, required:true} // 1 = Normal User, 2 = Admin
    },
    {
        collection: `users`
    })

module.exports = mongoose.model(`users`, userSchema)