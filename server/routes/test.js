const router = require(`express`).Router()

router.get('/api/test', (req, res) => {
    let cars = [
        {_id:0, model:"Avensis", colour:"Red", year:2020, price:30000},
        {_id:1, model:"Yaris", colour:"Green", year:2010, price:2000},
        {_id:2, model:"Corolla", colour:"Red", year:2019, price:20000}
    ];
    res.json(cars);
});

module.exports = router