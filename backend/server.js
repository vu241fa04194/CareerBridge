const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables directly from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// Allowed CORS origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5050',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5050',
  process.env.CLIENT_URL,
].filter(Boolean);

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    database: 'Firebase (Cloud Firestore & Firebase Auth)',
    timestamp: new Date().toISOString(),
    service: 'CareerBridge Backend API',
    version: '2.0.0',
  });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 CareerBridge Server running on port ${PORT}`);
  console.log(`🔥 Database & Auth: Migrated to Firebase`);
  console.log(`🌐 Base API: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const fallbackPort = Number(PORT) + 1;
    console.warn(`Port ${PORT} is in use, starting on fallback port ${fallbackPort}...`);
    app.listen(fallbackPort, () => {
      console.log(`🚀 CareerBridge Backend running on port ${fallbackPort}`);
      console.log(`🌐 Base API: http://localhost:${fallbackPort}/api/health`);
    });
  } else {
    console.error('Server error:', err);
  }
});

module.exports = app;
