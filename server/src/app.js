const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const tvRoutes = require('./routes/tv');
const searchRoutes = require('./routes/search');
const watchlistRoutes = require('./routes/watchlist');
const historyRoutes = require('./routes/history');
const profileRoutes = require('./routes/profiles');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'streamvault-api' }));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/tv', tvRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/profiles', profileRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not Found', path: req.path }));
app.use(errorHandler);

module.exports = app;
