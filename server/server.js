require('dotenv').config({path:`./config/.env`});
const express = require('express');
const cors = require('cors'); // 1. Import it properly

const app = express();
const port = process.env.SERVER_PORT || 4000;

// 2. IMPORTANT: You must use app.use() to activate the middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow your Vite/React dev server
    credentials: true
}));

app.get('/api/test', (req, res) => {
    let cars = [
        {_id:0, model:"Avensis", colour:"Red", year:2020, price:30000},
        {_id:1, model:"Yaris", colour:"Green", year:2010, price:2000},
        {_id:2, model:"Corolla", colour:"Red", year:2019, price:20000}
    ];
    res.json(cars); // res.json is better for sending arrays/objects
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});