const router = require(`express`).Router()
const ordersModel = require(`../models/orders`)
const productsModel = require(`../models/products`)
const {validateString, checkThatUserIsAnAdministrator} = require("./middleware");
const createError = require("http-errors");
const {verifyUsersJWTPassword} = require("./middleware");

// MIDDLEWARE

const getAllOrders = (req, res, next) =>
{
    ordersModel.find({})
        .then(data =>
        {
            res.json(data);
        })
        .catch(err => next(createError(500, `A server error has occurred.`)));
}

const getOneOrder = (req, res, next) =>
{
    ordersModel.findById(req.params.id)
        .then(data =>
        {
            res.json(data);
        })
        .catch(err => next(createError(500, `A server error has occurred.`)));
}

const validateOrderData = (req, res, next) =>
{
    if(validateString(req.body.fname) &&
        validateString(req.body.lname) &&
        validateString(req.body.email) &&
        validateString(req.body.phone) &&
        validateString(req.body.address_line_1) &&
        validateString(req.body.address_line_2) &&
        validateString(req.body.postcode) &&
        validateString(req.body.county) &&
        validateString(req.body.country) &&
        validateString(req.body.status) &&
        validateString(req.body.creator_id))
    {
        next()
    } else {
        next(createError(400, `Invalid input data`));
    }
}

const createNewOrderDocument = (req, res, next) =>
{
    ordersModel.create({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        total_gross: req.body.total_gross,
        vat: req.body.vat,
        delivery_cost: req.body.delivery_cost,
        total_net: req.body.total_net,
        address_line_1: req.body.address_line_1,
        address_line_2: req.body.address_line_2,
        postcode: req.body.postcode,
        county: req.body.county,
        country: req.body.country,
        products: req.body.products,
        status: req.body.status,
        creator_id: req.body.creator_id
    })
        .then(data =>
        {
            res.json(data)
        })
        .catch(err => next(createError(500, `A server error has occurred.`)));
}

const validateOrderUpdateData = (req, res, next) =>
{
    if(validateString(req.body.status))
    {
        next()
    } else {
        next(createError(400, `Invalid input data`));
    }
}

const updateOrderDocument = (req, res, next) =>
{
    let updateData = {
        status: req.body.status,
    };
    ordersModel.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            next(createError(500, `A server error has occurred.`));
        });
}

const createPayPalOrder = (req, res, next) => {
    if (req.params.productID !== "cart") {
        return next(createError(400, "Only cart purchases are allowed"));
    }

    const productIds = req.body.productIds || [];
    if (productIds.length === 0) {
        return next(createError(400, "No products in cart"));
    }

    // Validate and parse price
    const price = parseFloat(req.params.price);
    if (isNaN(price) || price <= 0) {
        return next(createError(400, `Invalid price value: ${req.params.price}`));
    }

    productsModel.find({'_id': {$in: productIds}})
        .then(products => {
            const orderData = {
                fname: req.body.customerName || "PayPal Customer",
                lname: req.body.customerName?.split(' ')[1] || "Customer", // Extract last name or use default
                email: req.body.customerEmail || "paypal@example.com",
                phone: "0000000000", // Default phone number
                total_gross: price,
                vat: 0,
                delivery_cost: 0,
                total_net: price,
                address_line_1: "PayPal Purchase",
                address_line_2: "",
                postcode: "00000", // Default postcode
                county: "Online", // Default county
                country: "Online", // Default country
                products: products,
                status: "Paid",
                paypalPaymentID: req.params.orderID,
                creator_id: req.body.userID || "guest"
            };

            return ordersModel.create(orderData);
        })
        .then(data => res.json({success:true, orderID: data._id}))
        .catch(err => next(err));
};

const decrementProductStock = (req, res, next) => {
    if (req.params.productID !== "cart") {
        return next(createError(400, "Only cart purchases are allowed"));
    }

    const productIds = req.body.productIds || [];
    if (productIds.length === 0) {
        return next(createError(400, "No products in cart"));
    }

    const stockUpdates = productIds.map(productId => 
        productsModel.findByIdAndUpdate(
            productId,
            {$inc: {stock_level: -1}}
        )
    );
    
    Promise.all(stockUpdates)
        .then(() => next())
        .catch(err => next(err));
};

// ROUTES

router.get(`/api/orders`, verifyUsersJWTPassword, getAllOrders)
router.get(`/api/orders/:id`, verifyUsersJWTPassword, getOneOrder)
router.post(`/api/orders`, verifyUsersJWTPassword, validateOrderData, createNewOrderDocument)
router.put(`/api/orders/:id`, verifyUsersJWTPassword, checkThatUserIsAnAdministrator, validateOrderUpdateData, updateOrderDocument)
router.post('/orders/paypal/:orderID/:productID/:price', decrementProductStock, createPayPalOrder)

module.exports = router