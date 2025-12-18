import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Load .env file
import productHandler from './api/products';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Adapter to match Vercel handler signature
// handler expects (req, res) where res has .status().json()
// Express req/res are compatible enough// Product API endpoint
app.get('/api/products', (req, res) => {
    // @ts-ignore
    productHandler(req, res);
});

app.listen(PORT, () => {
    console.log(`✅ Development API server running on http://localhost:${PORT}`);
    console.log(`👉 API Endpoint: http://localhost:${PORT}/api/products`);
});
