const router = require(`express`).Router()
const productsModel = require(`../models/products`)
const {validateString, validatePrice, validateDate} = require("./middleware");
const createError = require("http-errors");
const {verifyUsersJWTPassword, checkThatUserIsAnAdministrator} = require("./middleware");
const fs = require('fs')

const multer = require('multer')
const upload = multer({dest: `${process.env.UPLOADED_FILES_FOLDER}`})

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

// MIDDLEWARE

const checkThatFileIsUploaded = (req, res, next) =>
{
    if(!req.file) {
        return next(createError(400, `No file was selected to be uploaded`));
    }
    next()
}

const checkThatFileIsAnImageFile = (req, res, next) =>
{
    if(req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/jpeg")
    {
        fs.unlink(`${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`, (error) => {
            return next(createError(400, `Only .png, .jpg and .jpeg format accepted`));
        })
    }
    else
    {
        next()
    }
}

const checkThatFileIsAnImageFileIfPresent = (req, res, next) =>
{
    if(req.file) {
        if(req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/jpeg") {
            fs.unlink(`${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`, () => {});
            return next(createError(400, `Only .png, .jpg and .jpeg format accepted`));
        }
    }
    next()
}

const validateProductData = (req, res, next) =>
{
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
        next()
    } else {
        // Clean up file if validation fails and file was uploaded
        if(req.file) fs.unlink(`${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`, () => {});
        next(createError(400, `Invalid input data`));
    }
}

const getFeaturedProducts = (req, res, next) =>
{
    productsModel.find({}).limit(3)
        .then(data =>
        {
            const imagePromises = data.map(product => getProductImage(product));
            Promise.all(imagePromises)
                .then(productsWithImages => {
                    res.json(productsWithImages);
                })
                .catch(err => next(createError(500, `Error processing images`)));
        })
        .catch(err => next(createError(500, `A server error has occurred.`)));
}

const getAllProducts = (req, res, next) =>
{
    productsModel.find({})
        .then(data =>
        {
            const imagePromises = data.map(product => getProductImage(product));
            Promise.all(imagePromises)
                .then(productsWithImages => {
                    res.json(productsWithImages);
                })
                .catch(err => next(createError(500, `Error processing images`)));
        })
        .catch(err => next(createError(500, `A server error has occurred.`)));
}

const getOneProduct = (req, res, next) => {
    productsModel.findById(req.params.id)
        .then(data =>
        {
            if(!data) return next(createError(404, "Product not found"));

            getProductImage(data).then(productWithImage => {
                res.json(productWithImage);
            });
        })
        .catch(err => next(createError(500, `A server error has occurred.`)));
}

const createNewProductDocument = (req, res, next) =>
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
}

const updateProductDocument = (req, res, next) => {
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
}

const calculateCartPricing = (req, res, next) => {
    const productIds = req.body.productIds || [];
    
    if (productIds.length === 0) {
        return next(createError(400, "No products in cart"));
    }

    productsModel.find({'_id': {$in: productIds}})
        .then(products => {
            // Calculate subtotal from current product prices
            const subtotal = products.reduce((sum, product) => sum + product.price, 0);
            
            // Define pricing constants
            const SHIPPING_THRESHOLD = 100; // Free shipping over €100
            const SHIPPING_COST = 7.99; // Standard shipping cost
            
            // Calculate shipping (free over threshold)
            const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
            
            // Calculate total (no VAT)
            const total = subtotal + shippingCost;
            
            const pricing = {
                subtotal: parseFloat(subtotal.toFixed(2)),
                vat: 0, // No VAT
                shippingCost: parseFloat(shippingCost.toFixed(2)),
                total: parseFloat(total.toFixed(2)),
                vatRate: 0, // No VAT
                shippingThreshold: SHIPPING_THRESHOLD,
                freeShipping: subtotal >= SHIPPING_THRESHOLD,
                products: products
            };
            
            res.json(pricing);
        })
        .catch(err => next(createError(500, `A server error has occurred.`)));
};

const deleteProductDocument = (req, res, next) =>
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
}

const getProductsByIds = (req, res, next) => {
    const productIds = req.body.productIds || [];
    
    if (productIds.length === 0) {
        return next(createError(400, "No product IDs provided"));
    }
    
    productsModel.find({'_id': {$in: productIds}})
        .then(data => {
            const imagePromises = data.map(product => getProductImage(product));
            Promise.all(imagePromises)
                .then(productsWithImages => {
                    res.json(productsWithImages);
                })
                .catch(err => next(createError(500, `Error processing images`)));
        })
        .catch(err => next(createError(500, `A server error has occurred.`)));
};

// ROUTES

router.get(`/api/products/featured`, getFeaturedProducts)
router.get(`/api/products`, getAllProducts)
router.get(`/api/products/:id`, getOneProduct)
router.post(`/api/products/by-ids`, getProductsByIds)
router.post(`/api/products/calculate-pricing`, calculateCartPricing)
router.post(`/api/products`, upload.single("image"), verifyUsersJWTPassword, checkThatUserIsAnAdministrator, checkThatFileIsUploaded, checkThatFileIsAnImageFile, validateProductData, createNewProductDocument)
router.put(`/api/products/:id`, upload.single("image"), verifyUsersJWTPassword, checkThatUserIsAnAdministrator, validateProductData, checkThatFileIsAnImageFileIfPresent, updateProductDocument)
router.delete(`/api/products/:id`, verifyUsersJWTPassword, checkThatUserIsAnAdministrator, deleteProductDocument)

module.exports = router