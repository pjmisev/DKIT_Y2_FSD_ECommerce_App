// Server-side global variables
require(`dotenv`).config({path:`./config/.env`})
require(`./config/db`)

// Express
const express = require(`express`)
const app = express()

app.use(require(`body-parser`).json())
app.use(require(`cors`)({credentials: true, origin: process.env.LOCAL_HOST}))


app.use(require(`./routes/products`))
app.use(require(`./routes/users`))

// Port
app.listen(process.env.SERVER_PORT, () =>
{
    console.log(`Connected to port ` + process.env.SERVER_PORT)
})

// Error 404
app.use((req, res, next) => {next(res.status(404).send("Not Found"))})

// Other errors
app.use(function (err, req, res, next)
{
    console.error(err.message)
    if (!err.statusCode)
    {
        err.statusCode = 500
    }
    res.status(err.statusCode).send(err.message)
})