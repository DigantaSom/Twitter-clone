require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');

const connectDB = require('./config/dbConn');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/root.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/tweets', require('./routes/tweet.routes'));
app.use('/api/replies', require('./routes/reply.routes'));
app.use('/api/inner-replies', require('./routes/inner-reply.routes'));

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

app.use(errorHandler);

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
