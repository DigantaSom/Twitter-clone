const express = require('express');
const path = require('path');

const router = express.Router();

// GET request: '/' or '/index' or '/index.html'
router.get('^/$|/index(.html)?', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;
