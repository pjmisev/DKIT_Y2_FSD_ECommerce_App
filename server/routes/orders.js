const router = require(`express`).Router()
const ordersModel = require(`../models/orders`)
const productsModel = require(`../models/products`)
const {validateString, checkThatUserIsAnAdministrator} = require("./middleware");
const createError = require("http-errors");
const {verifyUsersJWTPassword} = require("./middleware");
const fs = require('fs')

const multer = require('multer')

// MIDDLEWARE

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

const getUserOrders = (req, res, next) =>
{
    const userId = req.decodedToken?.id || req.body.userID || "guest";
    ordersModel.find({creator_id: userId})
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
        total_gross: req.body.total_gross,
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
    console.log("=== PAYPAL ORDER REQUEST RECEIVED ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Decoded token:", JSON.stringify(req.decodedToken, null, 2));
    console.log("=====================================");
    
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

    // Extract user ID from JWT token
    const userId = req.decodedToken?.id || req.body.userID || "guest";
    console.log("Extracted userId:", userId);

    productsModel.find({'_id': {$in: productIds}})
        .then(products => {
            // Extract customer information from PayPal data
            const firstName = req.body.customerFirstName || req.body.customerName?.split(' ')[0] || "PayPal";
            const lastName = req.body.customerLastName || req.body.customerName?.split(' ').slice(1).join(' ') || "Customer";


            // Use pricing breakdown from request, or calculate as fallback
            let pricing;
            if (req.body.pricing && req.body.pricing.subtotal !== undefined) {
                pricing = req.body.pricing;
            } else {
                // Fallback calculation (no VAT)
                const subtotal = products.reduce((sum, product) => sum + product.price, 0);
                const SHIPPING_THRESHOLD = 100;
                const SHIPPING_COST = 7.99;
                const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
                const total = subtotal + shippingCost;
                
                pricing = {
                    subtotal: parseFloat(subtotal.toFixed(2)),
                    shippingCost: parseFloat(shippingCost.toFixed(2)),
                    total: parseFloat(total.toFixed(2))
                };
            }
            
            const orderData = {
                // Customer name
                fname: firstName,
                lname: lastName,
                
                // Customer contact information
                email: req.body.customerEmail || "paypal@example.com",
                
                // Order pricing (use calculated breakdown)
                total_gross: pricing.total,
                delivery_cost: pricing.shippingCost,
                total_net: pricing.subtotal,
                
                // Customer address (from PayPal)
                address_line_1: req.body.addressLine1 || "PayPal Purchase",
                address_line_2: req.body.addressLine2 || "",
                postcode: req.body.postcode || "00000",
                county: req.body.county || req.body.state || "Online",
                country: req.body.country || "Online",
                products: productIds,
                status: "Paid",
                paypalPaymentID: req.params.orderID,
                paypalPayerID: req.body.paypalPayerID,
                creator_id: userId
            };

            console.log("=== FINAL ORDER DATA ===");
            console.log(JSON.stringify(orderData, null, 2));
            console.log("========================");

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

const processReturn = (req, res, next) => {
    const orderId = req.params.id;
    
    ordersModel.findById(orderId)
        .then(order => {
            if (!order) {
                return next(createError(404, "Order not found"));
            }
            
            if (order.status === "Returned") {
                return next(createError(400, "Order has already been returned"));
            }
            
            if (order.status !== "Paid" && order.status !== "Delivered") {
                return next(createError(400, "Order cannot be returned"));
            }
            
            // Update product stock for each product in the order
            const stockUpdates = order.products.map(product => 
                productsModel.findByIdAndUpdate(
                    product._id,
                    {$inc: {stock_level: 1}}
                )
            );
            
            // Execute stock updates
            return Promise.all(stockUpdates)
                .then(() => {
                    // Update order status to "Returned"
                    return ordersModel.findByIdAndUpdate(
                        orderId,
                        {status: "Returned"},
                        {returnDocument: 'after'}
                    );
                });
        })
        .then(updatedOrder => {
            res.json({
                success: true,
                message: "Order processed for return successfully",
                order: updatedOrder
            });
        })
        .catch(err => {
            next(createError(500, "A server error has occurred while processing return."));
        });
};

// ROUTES

router.get(`/api/orders`, verifyUsersJWTPassword, getAllOrders)
router.get(`/api/orders/:id`, verifyUsersJWTPassword, getOneOrder)
router.get(`/api/user/orders`, verifyUsersJWTPassword, getUserOrders)
router.post(`/api/orders`, verifyUsersJWTPassword, validateOrderData, createNewOrderDocument)
router.put(`/api/orders/:id`, verifyUsersJWTPassword, checkThatUserIsAnAdministrator, validateOrderUpdateData, updateOrderDocument)
router.post('/orders/paypal/:orderID/:productID/:price', verifyUsersJWTPassword, decrementProductStock, createPayPalOrder)
router.post(`/api/orders/:id/return`, verifyUsersJWTPassword, processReturn)

module.exports = router