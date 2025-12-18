import express from 'express';
import cors from 'cors';
import handler from './api/products';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Adapter to match Vercel handler signature
// handler expects (req, res) where res has .status().json()
// Express req/res are compatible enough for this usage.
app.get('/api/products', async (req, res) => {
    try {
        await handler(req as any, res as any);
    } catch (error) {
        console.error('Unhandled Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Development API server running on http://localhost:${PORT}`);
    console.log(`👉 API Endpoint: http://localhost:${PORT}/api/products`);
});
