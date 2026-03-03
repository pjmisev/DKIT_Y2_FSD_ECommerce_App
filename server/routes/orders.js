const router = require(`express`).Router()
const ordersModel = require(`../models/orders`)
const {validateString, validatePrice, validateDate} = require("../lib/validation"); // Removed validateFile from here, logic moved to route
const createError = require("http-errors");
const jwt = require('jsonwebtoken')
const fs = require('fs')

const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

router.get(`/api/orders`, (req, res, next) =>
{
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) =>
    {
        // if (err) return next(createError(403, `User is not logged in`));
        // if(decodedToken.accessLevel < process.env.ACCESS_LEVEL_ADMIN) return next(createError(403, `User is not an administrator`));

        ordersModel.find({})
            .then(data =>
            {
                res.json(data);
            })
            .catch(err => next(createError(500, `A server error has occurred.`)));
    })
})

router.get(`/api/orders/:id`, (req, res, next) => {

    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) =>
    {
        // if (err) return next(createError(403, `User is not logged in`));
        // if(decodedToken.accessLevel < process.env.ACCESS_LEVEL_ADMIN) return next(createError(403, `User is not an administrator`));

        ordersModel.findById(req.params.id)
            .then(data =>
            {
                console.log(decodedToken)
                // if(decodedToken._id) return next(createError(403, `User is not the creator of this order.`));
                res.json(data);
            })
            .catch(err => next(createError(500, `A server error has occurred.`)));
    })
})

router.post(`/api/orders`, (req, res, next) =>
{
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) =>
    {
        // if (err) return next(createError(403, `User is not logged in`));

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
                }
                )
                .catch(err => next(createError(500, `A server error has occurred.`)));
        } else {
            next(createError(400, `Invalid input data`));
        }
    })
})

router.put(`/api/orders/:id`, (req, res, next) =>
{
    jwt.verify(req.headers.authorization, JWT_PRIVATE_KEY, {algorithm: "HS256"}, (err, decodedToken) =>
    {
        // if (err) return next(createError(403, `User is not logged in`));
        // if(decodedToken.accessLevel < process.env.ACCESS_LEVEL_ADMIN) return next(createError(403, `User is not an administrator`));

        if(
            validateString(req.body.status)
        )
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
        } else {
            next(createError(400, `Invalid input data`));
        }
    })
})

module.exports = router