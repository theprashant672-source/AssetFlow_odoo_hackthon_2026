import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import assetRoutes from './routes/assetRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/assets', assetRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
