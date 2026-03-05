const router = require(`express`).Router()
const usersModel = require(`../models/users`)
const createError = require('http-errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

// Login
router.post(`/api/users/login/:email/:password`, (req, res, next) => {
    usersModel.findOne({email: req.params.email})
        .then(data => {
            if(!data) {
                return next(createError(403, `User is not logged in`))
            }

            bcrypt.compare(req.params.password, data.password, (err, result) => {
                if (result) {
                    const token = jwt.sign(
                        {id: data._id, email: data.email, accessLevel: data.accessLevel},
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
router.post(`/api/users/register/:fname/:lname/:email/:password`, (req, res, next) => {
    usersModel.findOne({email: req.params.email})
        .then(uniqueData => {
            if (uniqueData) {
                return next(createError(403, `User already exists`))
            } else {
                // Hash Password
                bcrypt.hash(req.params.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) => {

                    // Create User
                    usersModel.create({
                        fname: req?.params?.fname,
                        lname: req?.params?.lname,
                        email: req?.params?.email,
                        password: hash,
                        status: req?.body?.status || true,
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

// Update user (admin only)
router.put(`/api/users/:id`, (req, res, next) => {
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: 'HS256'}, (err, decodedToken) => {
        if (err) return next(createError(403, `User is not logged in`));
        if(decodedToken.accessLevel < process.env.ACCESS_LEVEL_ADMIN) return next(createError(403, `User is not an administrator`));
        
        const updateData = {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            accessLevel: req.body.accessLevel,
            status: req.body.status
        };
        
        // Only update password if provided
        if (req.body.password) {
            bcrypt.hash(req.body.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) => {
                if (err) return next(createError(500, `Error hashing password`));
                updateData.password = hash;
                
                usersModel.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' })
                    .then(data => {
                        if(!data) return next(createError(404, "User not found"));
                        res.json(data);
                    })
                    .catch(err => next(createError(500, `Server Error`)));
            });
        } else {
            usersModel.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' })
                .then(data => {
                    if(!data) return next(createError(404, "User not found"));
                    res.json(data);
                })
                .catch(err => next(createError(500, `Server Error`)));
        }
    });
});

// Get all users (admin only)
router.get(`/api/users`, (req, res, next) => {
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: 'HS256'}, (err, decodedToken) => {
        if (err) return next(createError(403, `User is not logged in`));
        if(decodedToken.accessLevel < process.env.ACCESS_LEVEL_ADMIN) return next(createError(403, `User is not an administrator`));
        
        usersModel.find({})
            .select('-password')
            .then(data => res.json(data))
            .catch(err => next(createError(500, `Server Error`)));
    });
});

// Get self
router.get(`/api/user`, (req, res, next) => {
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithms: ['HS256']}, (err, decodedToken) => {
        if (err) return next(createError(401, `Invalid or expired token`));
        usersModel.findById(decodedToken.id)
            .select('-password')
            .then(user => {
                if (!user) return next(createError(404, `User not found`));
                res.json(user);
            })
            .catch(err => next(createError(500, `Server Error`)));
    });
});

// Logout
router.post(`/api/users/logout`, (req, res, next) => {
    res.json({});
})

module.exports = router