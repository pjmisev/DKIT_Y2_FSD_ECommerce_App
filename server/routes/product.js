const router = require(`express`).Router()
const productModel = require(`../models/product`)

router.get(`/products`, (req, res) =>
{
    productModel.find({})
        .then(data =>
        {
            res.json(data)
        })
        .catch(res.json(500, {
            error: "An error has occurred."
        }));
})

router.get(`/products/:id`, (req, res) => {
    productModel.findById(req.params.id)
        .then(data =>
        {
            res.json(data)
        })
        .catch(res.json(500, {
            error: "An error has occurred."
        }));
})

router.post(`/products`, (req, res) =>
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
            .catch(res.json(500, {
                error: "An error has occurred."
            }));
    } else {
        res.json(400, {
            error: "Not enough data provided."
        })
    }
})

router.put(`/products/:id`, (req, res) => {
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
        { new: true }
    )
        .then(data => {
            res.json(data);
        })
        .catch(res.json(500, {
            error: "An error has occurred."
        }));
});

router.delete(`/products/:id`, (req, res) =>
{
    productModel.findByIdAndDelete(req.params.id)
        .then(data =>
        {
            res.json(data)
        })
        .catch(res.json(500, {
            error: "An error has occurred."
        }));
})

module.exports = router