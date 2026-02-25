const router = require(`express`).Router()
const productsModel = require(`../models/products`)
const {validateString, validatePrice, validateDate, validateFile} = require("../lib/validation"); // Removed validateFile from here, logic moved to route
const createError = require("http-errors");
const jwt = require('jsonwebtoken')
const fs = require('fs')

const multer = require('multer')
const upload = multer({dest: `${process.env.UPLOADED_FILES_FOLDER}`})

const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')


const getProductImage = (product) => {
    return new Promise((resolve) => {
        if (!product.image) {
            resolve({ ...product.toObject(), image: null });
            return;
        }
        const filePath = `${process.env.UPLOADED_FILES_FOLDER}/${product.image}`;

        fs.readFile(filePath, 'base64', (err, fileData) => {
            if (err) {
                resolve({ ...product.toObject(), image: null });
            } else {
                resolve({ ...product.toObject(), image: fileData });
            }
        });
    });
};


router.get(`/api/products`, (req, res, next) =>
{
    productsModel.find({})
        .then(data =>
        {
            // Map all products to promises that read their images
            const imagePromises = data.map(product => getProductImage(product));

            Promise.all(imagePromises)
                .then(productsWithImages => {
                    res.json(productsWithImages);
                })
                .catch(err => next(createError(500, `Error processing images`)));
        })
        .catch(err => next(createError(500, `A server error has occurred.`)));
})

router.get(`/api/products/:id`, (req, res, next) => {
    productsModel.findById(req.params.id)
        .then(data =>
        {
            if(!data) return next(createError(404, "Product not found"));

            getProductImage(data).then(productWithImage => {
                res.json(productWithImage);
            });
        })
        .catch(err => next(createError(500, `A server error has occurred.`)));
})

router.post(`/api/products`, upload.single("image"), (req, res, next) =>
{
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) =>
    {
        if (err) return next(createError(403, `User is not logged in`));
        if(decodedToken.accessLevel < process.env.ACCESS_LEVEL_ADMIN) return next(createError(403, `User is not an administrator`));

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

        if(validateString(req.body.category) &&
            validateString(req.body.brand) &&
            validateString(req.body.model) &&
            validateString(req.body.description) &&
            validateString(req.body.colour) &&
            validateDate(req.body.release_date) &&
            validateString(req.body.energy_rating) &&
            validatePrice(req.body.price) &&
            validateString(req.body.stocking_status))
        {
            productsModel.create({
                category: req.body.category,
                brand: req.body.brand,
                model: req.body.model,
                description: req.body.description,
                colour: req.body.colour,
                release_date: req.body.release_date,
                energy_rating: req.body.energy_rating,
                price: req.body.price,
                status: req.body.status || true,
                image: req.file.filename,
                stocking_status: req.body.stocking_status,
                stock_level: req.body.stock_level
            })
                .then(data => {
                    getProductImage(data).then(response => res.json(response));
                })
                .catch(err => next(createError(500, `A server error has occurred.`)));
        } else {
            fs.unlink(`${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`, () => {});
            next(createError(400, `Invalid input data`));
        }
    })
})

router.put(`/api/products/:id`, upload.single("image"), (req, res, next) => {

    if(
        validateString(req.body.category) &&
        validateString(req.body.brand) &&
        validateString(req.body.model) &&
        validateString(req.body.description) &&
        validateString(req.body.colour) &&
        validateDate(req.body.release_date) &&
        validateString(req.body.energy_rating) &&
        validatePrice(req.body.price) &&
        validateString(req.body.stocking_status)
    ){
        let updateData = {
            category: req.body.category,
            brand: req.body.brand,
            model: req.body.model,
            description: req.body.description,
            colour: req.body.colour,
            release_date: req.body.release_date,
            energy_rating: req.body.energy_rating,
            price: req.body.price,
            status: req.body.status !== undefined ? req.body.status === 'true' || req.body.status === true : true,
            stocking_status: req.body.stocking_status,
            stock_level: req.body.stock_level
        };

        if (req.file) {
            if(req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/jpeg") {
                fs.unlink(`${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`, () => {});
                return next(createError(400, `Only .png, .jpg and .jpeg format accepted`));
            }
            updateData.image = req.file.filename;
        }

        productsModel.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' })
            .then(data => {
                if(!data) return next(createError(404, "Product not found"));
                getProductImage(data).then(response => res.json(response));
            })
            .catch(err => {
                console.error('Database update error:', err);
                next(createError(500, `A server error has occurred.`));
            });
    } else {
        console.error('Validation failed for:', req.body);
        next(createError(400, `Invalid input data`));
    }
});

router.delete(`/api/products/:id`, (req, res, next) =>
{
    productsModel.findByIdAndDelete(req.params.id)
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