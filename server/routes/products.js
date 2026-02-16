const router = require(`express`).Router()
const productsModel = require(`../models/products`)
const {validateString, validatePrice, validateDate} = require("../lib/validation");
const createError = require("http-errors");

router.get(`/api/products`, (req, res, next) =>
{
    productsModel.find({})
        .then(data =>
        {
            res.json(data)
        })
        .catch(err => {
            next(createError(500, `A server error has occurred.`))
        });
})

router.get(`/api/products/:id`, (req, res, next) => {
    productsModel.findById(req.params.id)
        .then(data =>
        {
            res.json(data)
        })
        .catch(err => {
            next(createError(500, `A server error has occurred.`))
        });
})

router.post(`/api/products`, (req, res, next) =>
{
    if(
        validateString(req.body.category) &&
        validateString(req.body.brand) &&
        validateString(req.body.model) &&
        validateString(req.body.description) &&
        validateString(req.body.colour) &&
        validateDate(req.body.release_date) &&
        validateString(req.body.energy_rating) &&
        validatePrice(req.body.price)
    ){
        productsModel.create([
            {
                category: req.body.category,
                brand: req.body.brand,
                model: req.body.model,
                description: req.body.description,
                colour: req.body.colour,
                release_date: req.body.release_date,
                energy_rating: req.body.energy_rating,
                price: req.body.price
            }
        ])
            .then(data =>
            {
                res.json(data)
            })
            .catch(err => {
                next(createError(500, `A server error has occurred.`))
            });
    } else {
        next(createError(400, `An error has occurred. Please check your input and try again.`))
    }
})

router.put(`/api/products/:id`, (req, res, next) => {
    if(
        validateString(req.body.category) &&
        validateString(req.body.brand) &&
        validateString(req.body.model) &&
        validateString(req.body.description) &&
        validateString(req.body.colour) &&
        validateDate(req.body.release_date) &&
        validateString(req.body.energy_rating) &&
        validatePrice(req.body.price)
    ){
        productsModel.findByIdAndUpdate(
            req.params.id,
            {
                category: req.body.category,
                brand: req.body.brand,
                model: req.body.model,
                description: req.body.description,
                colour: req.body.colour,
                release_date: req.body.release_date,
                energy_rating: req.body.energy_rating,
                price: req.body.price
            },
            { returnDocument: 'after' }
        )
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                next(createError(500, `A server error has occurred.`))
            });
    } else {
        next(createError(400, `An error has occurred. Please check your input and try again.`))
    }

});

router.delete(`/api/products/:id`, (req, res, next) =>
{
    productsModel.findByIdAndDelete(req.params.id)
        .then(data =>
        {
            res.json(data)
        })
        .catch(err => {
            next(createError(500, `A server error has occurred.`))
        });
})

module.exports = router