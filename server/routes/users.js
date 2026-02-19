const router = require(`express`).Router()
const usersModel = require(`../models/users`)
const createError = require('http-errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

// Login
router.post(`/users/login/:email/:password`, (req, res, next) => {
    usersModel.findOne({email: req.params.email})
        .then(data => {
            if(!data) {
                return next(createError(403, `User is not logged in`))
            }

            bcrypt.compare(req.params.password, data.password, (err, result) => {
                if (result) {
                    const token = jwt.sign(
                        {email: data.email, accessLevel: data.accessLevel},
                        JWT_PRIVATE_KEY,
                        {algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY}
                    )
                    res.json({name: data.fname, accessLevel: data.accessLevel, token: token})
                } else {
                    return next(createError(403, `User is not logged in`))
                }
            })
        })
        .catch(err => next(createError(500, `Server Error`)))
})

// Register
router.post(`/users/register/:name/:email/:password`, (req, res, next) => {
    usersModel.findOne({email: req.params.email})
        .then(uniqueData => {
            if (uniqueData) {
                return next(createError(403, `User already exists`))
            } else {
                // Hash Password
                bcrypt.hash(req.params.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) => {

                    // Create User
                    usersModel.create({
                        fname: req.params.name,
                        lname: req.params.lname,
                        email: req.params.email,
                        password: hash,
                        accessLevel: parseInt(process.env.ACCESS_LEVEL_NORMAL_USER)
                    })
                        .then(data => {
                            const token = jwt.sign(
                                {email: data.email, accessLevel: data.accessLevel},
                                JWT_PRIVATE_KEY,
                                {algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY}
                            )

                            res.json({name: data.fname, accessLevel: data.accessLevel, token: token})
                        })
                        .catch(err => next(createError(409, `User was not registered`)))
                })
            }
        })
        .catch(err => next(err))
})

// Logout
router.post(`/users/logout`, (req, res, next) => {
    res.json({})
})

module.exports = router