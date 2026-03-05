const router = require(`express`).Router()
const usersModel = require(`../models/users`)
const createError = require('http-errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const {verifyUsersJWTPassword} = require("./middleware");

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

// MIDDLEWARE

const checkThatUserIsAnAdministrator = (req, res, next) =>
{
    if(req.decodedToken.accessLevel >= process.env.ACCESS_LEVEL_ADMIN)
    {
        next()
    }
    else
    {
        next(createError(403, `User is not an administrator`))
    }
}

// Login Middleware
const checkThatUserExistsInUsersCollection = (req, res, next) =>
{
    usersModel.findOne({email: req.params.email})
        .then(data => {
            if(!data) {
                return next(createError(403, `User is not logged in`))
            }
            req.data = data
            next()
        })
        .catch(err => next(createError(500, `Server Error`)))
}

const checkThatJWTPasswordIsValid = (req, res, next) =>
{
    bcrypt.compare(req.params.password, req.data.password, (err, result) =>
    {
        if (result) {
            next()
        } else {
            return next(createError(403, `User is not logged in`))
        }
    })
}

const returnUserTokenAsJSON = (req, res, next) =>
{
    const token = jwt.sign(
        {id: req.data._id, email: req.data.email, accessLevel: req.data.accessLevel},
        JWT_PRIVATE_KEY,
        {algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY}
    )
    res.json({name: req.data.fname, accessLevel: req.data.accessLevel, token: token})
}

// Register Middleware
const checkThatUserIsNotAlreadyInUsersCollection = (req, res, next) =>
{
    usersModel.findOne({email: req.params.email})
        .then(uniqueData => {
            if (uniqueData) {
                return next(createError(403, `User already exists`))
            } else {
                next()
            }
        })
        .catch(err => next(err))
}

const hashPassword = (req, res, next) =>
{
    bcrypt.hash(req.params.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) => {
        if(err) return next(createError(500, "Error hashing password"));
        req.hashedPassword = hash;
        next();
    })
}

const addNewUserToUsersCollection = (req, res, next) =>
{
    usersModel.create({
        fname: req?.params?.fname,
        lname: req?.params?.lname,
        email: req?.params?.email,
        password: req.hashedPassword,
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
}

// Update Middleware
const prepareUpdateData = (req, res, next) =>
{
    req.updateData = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        accessLevel: req.body.accessLevel,
        status: req.body.status
    };
    next();
}

const hashPasswordIfProvided = (req, res, next) =>
{
    if (req.body.password) {
        bcrypt.hash(req.body.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) => {
            if (err) return next(createError(500, `Error hashing password`));
            req.updateData.password = hash;
            next();
        });
    } else {
        next();
    }
}

const updateUserDocument = (req, res, next) =>
{
    usersModel.findByIdAndUpdate(req.params.id, req.updateData, { returnDocument: 'after' })
        .then(data => {
            if(!data) return next(createError(404, "User not found"));
            res.json(data);
        })
        .catch(err => next(createError(500, `Server Error`)));
}

// Image Middleware
const checkThatFileIsUploaded = (req, res, next) =>
{
    if(!req.file) {
        return next(createError(400, `No file was selected to be uploaded`));
    }
    next();
}

const checkThatFileIsAnImageFile = (req, res, next) =>
{
    if(req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/jpeg")
    {
        fs.unlink(`${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`, (error) => {
            return next(createError(400, `Only .png, .jpg and .jpeg format accepted`));
        })
    } else {
        next();
    }
}

const updateUserProfileImage = (req, res, next) =>
{
    usersModel.findByIdAndUpdate(req.decodedToken.id, {image: req.file.filename}, { returnDocument: 'after' })
        .then(user => {
            if(!user) return next(createError(404, `User not found`));
            getUserImage(user).then(userWithImage => {
                res.json(userWithImage);
            });
        })
        .catch(err => next(createError(500, `Server Error`)));
}

// Get Data Middleware
const getAllUsers = (req, res, next) =>
{
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
}

const getSelf = (req, res, next) =>
{
    usersModel.findById(req.decodedToken.id)
        .select('-password')
        .then(user => {
            if (!user) return next(createError(404, `User not found`));
            getUserImage(user).then(userWithImage => {
                res.json(userWithImage);
            });
        })
        .catch(err => next(createError(500, `Server Error`)));
}

const deleteUserDocument = (req, res, next) =>
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
}

const logout = (req, res, next) =>
{
    res.json({});
}

// ROUTES

router.post(`/api/users/login/:email/:password`, checkThatUserExistsInUsersCollection, checkThatJWTPasswordIsValid, returnUserTokenAsJSON)
router.post(`/api/users/register/:fname/:lname/:email/:password`, checkThatUserIsNotAlreadyInUsersCollection, hashPassword, addNewUserToUsersCollection)
router.put(`/api/users/:id`, verifyUsersJWTPassword, checkThatUserIsAnAdministrator, prepareUpdateData, hashPasswordIfProvided, updateUserDocument)
router.get(`/api/users`, verifyUsersJWTPassword, checkThatUserIsAnAdministrator, getAllUsers)
router.get(`/api/user`, verifyUsersJWTPassword, getSelf)
router.post(`/api/user/upload-image`, upload.single("image"), verifyUsersJWTPassword, checkThatFileIsUploaded, checkThatFileIsAnImageFile, updateUserProfileImage)
router.post(`/api/users/logout`, logout)
router.delete(`/api/users/:id`, verifyUsersJWTPassword, deleteUserDocument)

module.exports = router