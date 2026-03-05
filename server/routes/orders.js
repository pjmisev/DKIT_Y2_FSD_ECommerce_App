const router = require(`express`).Router()
const ordersModel = require(`../models/orders`)
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

// ROUTES

router.get(`/api/orders`, verifyUsersJWTPassword, getAllOrders)
router.get(`/api/orders/:id`, verifyUsersJWTPassword, getOneOrder)
router.post(`/api/orders`, verifyUsersJWTPassword, validateOrderData, createNewOrderDocument)
router.put(`/api/orders/:id`, verifyUsersJWTPassword, checkThatUserIsAnAdministrator, validateOrderUpdateData, updateOrderDocument)

module.exports = router