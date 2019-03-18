const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');


router.get('/login', (req, res) => res.render('login'));

router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
  const { name, email, password, password_confirmation } = req.body;
  let errors = [];

  if(!name || !email || !password || !password_confirmation) {
    errors.push({msg: 'Please fill in all fields'});
  }

  if(password !== password_confirmation) {
    errors.push({ msg: 'Password do not match'});
  }

  if(password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters'});
  }

  if(errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password_confirmation
    });
  } else {
    User.findOne({ email: email})
      .then(user => {
        if(user) {
          errors.push({ msg: 'Email is already registred'});
          res.render('register', {
            errors,
            name,
            email,
            password,
            password_confirmation
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });

          bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;

            newUser.password = hash;

            newUser.save()
              .then(user => {
                req.flash('success_msg', 'You are now registred and can login');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          }))
        }
      })
  }
  
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
})

module.exports = router;