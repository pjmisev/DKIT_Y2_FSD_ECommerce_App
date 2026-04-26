const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Product = require('./models/products'); 
require('dotenv').config();

const dbURI = 'mongodb://127.0.0.1:27017/SustainableDB';
const UPLOAD_PATH = process.env.UPLOADED_FILES_FOLDER || './uploads';

if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}

/**
 * Generates a high-quality text-based placeholder image
 */
const downloadImage = async (text, index) => {
    const filename = `seed_${index}.jpg`;
    const filePath = path.join(UPLOAD_PATH, filename);
    
    // We use placehold.jp because it is extremely stable for development
    const encodedText = encodeURIComponent(text);
    const url = `https://placehold.jp/24/333333/ffffff/400x400.jpg?text=${encodedText}`;

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 5000
        });

        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            writer.on('finish', () => resolve(filename));
            writer.on('error', reject);
        });
    } catch (e) {
        console.error(`\nFallback failed for ${text}: ${e.message}`);
        return ""; 
    }
};

const seedProducts = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log("Connected to MongoDB. Wiping old data...");
        await Product.deleteMany({});

        const products = [];

        for (let i = 1; i <= 20; i++) {
            const isAirFryer = i <= 10;
            const category = isAirFryer ? "Kitchen Appliances" : "Laundry";
            const modelName = isAirFryer ? `Eco-Airfryer ${i}` : `Green-Washer ${i}`;
            
            process.stdout.write(`  > Generating image for ${modelName}... \r`);
            
            const imageName = await downloadImage(modelName, i);

            products.push({
                category: category,
                brand: isAirFryer ? "EcoChef" : "AquaSave",
                model: modelName,
                description: `A highly sustainable ${isAirFryer ? 'air fryer' : 'washing machine'} designed for the modern eco-friendly home.`,
                colour: i % 2 === 0 ? "Slate" : "Silver",
                release_date: new Date(),
                energy_rating: "A+++",
                price: isAirFryer ? (100 + i * 5) : (450 + i * 10),
                status: true,
                image: imageName,
                stocking_status: "In Stock",
                stock_level: 10 + i
            });
        }

        await Product.insertMany(products);
        console.log("\n\n--- SUCCESS: 20 Products seeded successfully ---");
        console.log(`Images are located in: ${UPLOAD_PATH}`);
        
    } catch (err) {
        console.error("\nSeed failed:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedProducts();