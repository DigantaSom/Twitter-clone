require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');

const connectDB = require('./config/dbConn');

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use('/', require('./routes/root.routes'));

// Fallback
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

// MongoDB connection
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB...');
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
});
mongoose.connection.on('error', err => {
  console.log('Error connecting to MongoDB:', err);
});
