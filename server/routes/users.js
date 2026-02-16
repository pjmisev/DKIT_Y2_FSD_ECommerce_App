const router = require(`express`).Router()
const usersModel = require(`../models/users`)
const createError = require('http-errors');
const {validateString, validateDate, validateEmail, validatePassword} = require("../lib/validation");
const {hash} = require("bcrypt");

router.get(`/api/users`, (req, res, next) => {
    usersModel.find({})
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            next(createError(500, `A server error has occurred.`))
        });
})

router.get(`/api/users/:id`, (req, res, next) => {
    usersModel.findById(req.params.id)
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            next(createError(500, `A server error has occurred.`))
        });
})

router.post(`/api/users`, async (req, res, next) => {
    if (
        validateString(req.body.fname) &&
        validateString(req.body.lname) &&
        validateEmail(req.body.email) &&
        validatePassword(req.body.password) &&
        validateDate(req.body.date_created)
    ) {

        try {
            const saltRounds = parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS) || 10;
            const hashedPassword = await hash(req.body.password, saltRounds);

            const data = await usersModel.create({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                password: hashedPassword,
                date_created: req.body.date_created
            });

            res.json(data);
        } catch
            (err) {
            next(createError(500, `A server error has occurred.`));
        }
    } else {
        next(createError(400, `An error has occurred. Please check your input and try again.`))
    }
});

router.put(`/api/users/:id`, (req, res, next) => {
    if (
        validateString(req.body.fname) &&
        validateString(req.body.lname) &&
        validateEmail(req.body.email) &&
        validateDate(req.body.date_created)
    ) {
        usersModel.findByIdAndUpdate(
            req.params.id,
            {
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                date_created: req.body.date_created
            },
            {returnDocument: 'after'}
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

router.delete(`/api/users/:id`, (req, res) => {
    usersModel.findByIdAndDelete(req.params.id)
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            next(createError(500, `A server error has occurred.`))
        });
})

module.exports = router