const router = require(`express`).Router()
const productModel = require(`../models/product`)

router.get(`/api/products`, (req, res) =>
{
    productModel.find({})
        .then(data =>
        {
            res.json(data)
        })
        .catch(err => {
            res.status(500).json({
                error: "An error has occurred."
            })
        });
})

router.get(`/api/products/:id`, (req, res) => {
    productModel.findById(req.params.id)
        .then(data =>
        {
            res.json(data)
        })
        .catch(err => {
            res.status(500).json({
                error: "An error has occurred."
            })
        });
})

router.post(`/api/products`, (req, res) =>
{
    if(
        req.body.category &&
        req.body.brand &&
        req.body.model &&
        req.body.description &&
        req.body.colour &&
        req.body.release_date &&
        req.body.energy_rating &&
        req.body.price
    ){
        productModel.create([
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
                res.status(500).json({
                    error: "An error has occurred."
                })
            });
    } else {
        res.status(400).json({
            error: "Not enough data provided."
        })
    }
})

router.put(`/api/products/:id`, (req, res) => {
    productModel.findByIdAndUpdate(
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
            res.status(500).json({
                error: "An error has occurred."
            })
        });
});

router.delete(`/api/products/:id`, (req, res) =>
{
    productModel.findByIdAndDelete(req.params.id)
        .then(data =>
        {
            res.json(data)
        })
        .catch(err => {
            res.status(500).json({
                error: "An error has occurred."
            })
        });
})

module.exports = router