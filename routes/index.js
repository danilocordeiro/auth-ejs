const express = require('express');
const router = express.Router();
const { loggedIn } = require('../config/auth');

router.get('/', (req, res) => res.render('welcome'));

router.get('/dashboard', loggedIn, (req, res) => 
  res.render('dashboard', {
    user: req.user
  })
);

module.exports = router;