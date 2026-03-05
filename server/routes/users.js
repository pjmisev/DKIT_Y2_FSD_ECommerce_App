const router = require(`express`).Router()
const usersModel = require(`../models/users`)
const createError = require('http-errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const fs = require('fs')
const {verifyUsersJWTPassword} = require("../lib/middleware");
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

const multer = require('multer')
const upload = multer({dest: `${process.env.UPLOADED_FILES_FOLDER}`})


const getUserImage = (user) => {
    return new Promise((resolve) => {
        if (!user.image) {
            resolve({ ...user.toObject(), image: null });
            return;
        }
        const filePath = `${process.env.UPLOADED_FILES_FOLDER}/${user.image}`;

        fs.readFile(filePath, 'base64', (err, fileData) => {
            if (err) {
                resolve({ ...user.toObject(), image: null });
            } else {
                resolve({ ...user.toObject(), image: fileData });
            }
        });
    });
};

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
router.put(`/api/users/:id`, verifyUsersJWTPassword, (req, res, next) => {
    if(req.decodedToken.accessLevel < process.env.ACCESS_LEVEL_ADMIN) return next(createError(403, `User is not an administrator`));

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

// Get all users (admin only)
router.get(`/api/users`, verifyUsersJWTPassword, (req, res, next) => {
    if(req.decodedToken.accessLevel < process.env.ACCESS_LEVEL_ADMIN) return next(createError(403, `User is not an administrator`));
    
    usersModel.find({})
        .select('-password')
        .then(users => {
            const imagePromises = users.map(user => getUserImage(user));
            Promise.all(imagePromises)
                .then(usersWithImages => {
                    res.json(usersWithImages);
                })
                .catch(err => next(createError(500, `Error processing images`)));
        })
        .catch(err => next(createError(500, `Server Error`)));
});

// Get self
router.get(`/api/user`, verifyUsersJWTPassword, (req, res, next) => {
    usersModel.findById(req.decodedToken.id)
        .select('-password')
        .then(user => {
            if (!user) return next(createError(404, `User not found`));
            getUserImage(user).then(userWithImage => {
                res.json(userWithImage);
            });
        })
        .catch(err => next(createError(500, `Server Error`)));
});

// Upload profile picture
router.post(`/api/user/upload-image`, upload.single("image"), verifyUsersJWTPassword, (req, res, next) => {
    if(!req.file) {
        return next(createError(400, `No file was selected to be uploaded`));
    }

    if(req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/jpeg")
    {
        fs.unlink(`${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`, (error) => {
            return next(createError(400, `Only .png, .jpg and .jpeg format accepted`));
        })
        return;
    }

    usersModel.findByIdAndUpdate(req.decodedToken.id, {image: req.file.filename}, { returnDocument: 'after' })
        .then(user => {
            if(!user) return next(createError(404, `User not found`));
            getUserImage(user).then(userWithImage => {
                res.json(userWithImage);
            });
        })
        .catch(err => next(createError(500, `Server Error`)));
});

// Logout
router.post(`/api/users/logout`, (req, res, next) => {
    res.json({});
})

// Delete User
router.delete(`/api/users/:id`, verifyUsersJWTPassword, (req, res, next) =>
{
    usersModel.findByIdAndDelete(req.params.id)
        .then(data =>
        {
            if(data && data.image) {
                fs.unlink(`${process.env.UPLOADED_FILES_FOLDER}/${data.image}`, () => {});
            }
            res.json(data)
        })
        .catch(err => next(createError(500, `A server error has occurred.`)));

})

module.exports = router