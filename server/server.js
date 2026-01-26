require(`dotenv`).config({path:`./config/.env`})
require(`cors`)({credentials: true, origin: process.env.LOCAL_HOST})

const express = require('express')
const app = express()
const port = process.env.SERVER_PORT;

app.get('/', (req, res) => {
    res.send('Wassup bruh')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
