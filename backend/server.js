import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/product.route.js';


dotenv.config();
const app = express();


// Middleware to parse JSON
app.use(express.json());


app.use("/api/products", productRoutes);


// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`✅ Server started at http://localhost:${PORT}`);
    } catch (error) {
        console.error("❌ Failed to connect to database:", error.message);
        process.exit(1);
    }
});
