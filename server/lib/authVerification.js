const {verify} = require("jsonwebtoken");
const fs = require("fs");
const createError = require("http-errors");
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

const verifyUsersJWTPassword = (req, res, next) =>
{
    verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) =>
    {
        if (err)
        {
            next(createError(403, `User is not logged in`))
        }
        else
        {
            req.decodedToken = decodedToken
            next()
        }
    })
}

module.exports = {
    verifyUsersJWTPassword
};