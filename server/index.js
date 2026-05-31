import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import collegesRoutes from './routes/colleges.js';
import reviewsRoutes from './routes/reviews.js';

dotenv.config();

const app = express();

// Middleware - Add compression for faster responses
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Cache middleware for GET requests
const cacheMiddleware = (req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300');
  }
  next();
};

app.use(cacheMiddleware);

// Initialize Supabase client with WebSocket support for Node.js 20
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    realtime: {
      transport: ws
    }
  }
);

// Routes
app.use('/api', collegesRoutes);
app.use('/api', reviewsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BECults Server running on http://localhost:${PORT}`);
});
