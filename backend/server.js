import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
try {
    await fs.access(uploadsDir);
} catch {
    await fs.mkdir(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
        }
    }
});

// In-memory database (replace with real DB in production)
let products = [];
let reviews = [];

// Load initial data
const dataFile = path.join(__dirname, 'data.json');
try {
    const data = await fs.readFile(dataFile, 'utf-8');
    const parsed = JSON.parse(data);
    products = parsed.products || [];
    reviews = parsed.reviews || [];
} catch {
    console.log('No existing data file, starting fresh');
}

// Save data helper
async function saveData() {
    await fs.writeFile(dataFile, JSON.stringify({ products, reviews }, null, 2));
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Amazonia Express API running' });
});

// Get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

// Create product
app.post('/api/products', async (req, res) => {
    const newProduct = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    await saveData();
    res.status(201).json(newProduct);
});

// Update product
app.put('/api/products/:id', async (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    products[index] = { ...products[index], ...req.body, updatedAt: new Date().toISOString() };
    await saveData();
    res.json(products[index]);
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    products.splice(index, 1);
    await saveData();
    res.json({ message: 'Producto eliminado' });
});

// Upload single image
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ url: imageUrl, filename: req.file.filename });
});

// Upload multiple images
app.post('/api/upload/multiple', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No se subieron imágenes' });
    }
    const urls = req.files.map(file => ({
        url: `http://localhost:${PORT}/uploads/${file.filename}`,
        filename: file.filename
    }));
    res.json(urls);
});

// Delete image
app.delete('/api/images/:filename', async (req, res) => {
    try {
        const filePath = path.join(uploadsDir, req.params.filename);
        await fs.unlink(filePath);
        res.json({ message: 'Imagen eliminada' });
    } catch (error) {
        res.status(404).json({ error: 'Imagen no encontrada' });
    }
});

// Get reviews for product
app.get('/api/products/:id/reviews', (req, res) => {
    const productReviews = reviews.filter(r => r.productId === req.params.id);
    res.json(productReviews);
});

// Add review
app.post('/api/products/:id/reviews', async (req, res) => {
    const newReview = {
        id: uuidv4(),
        productId: req.params.id,
        ...req.body,
        fecha: new Date().toISOString()
    };
    reviews.push(newReview);

    // Update product rating
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex !== -1) {
        const productReviews = reviews.filter(r => r.productId === req.params.id);
        const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
        products[productIndex].rating = avgRating;
        products[productIndex].totalReviews = productReviews.length;
    }

    await saveData();
    res.status(201).json(newReview);
});

// Bulk update products (for import)
app.post('/api/products/bulk', async (req, res) => {
    const { products: newProducts, replace } = req.body;

    if (replace) {
        products = newProducts;
    } else {
        newProducts.forEach(newProd => {
            const index = products.findIndex(p => p.id === newProd.id);
            if (index !== -1) {
                products[index] = { ...products[index], ...newProd };
            } else {
                products.push(newProd);
            }
        });
    }

    await saveData();
    res.json({ message: `${newProducts.length} productos actualizados`, count: products.length });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Error del servidor' });
});

app.listen(PORT, () => {
    console.log(`🚀 Amazonia Express API running on http://localhost:${PORT}`);
    console.log(`📁 Uploads directory: ${uploadsDir}`);
});
