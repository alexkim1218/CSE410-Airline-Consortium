const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');

/* GET login. */
router.get('/login', function (req, res) {
  res.render('login', {title: 'Big Market'});
});

/* GET signup. */
router.get('/signup', function (req, res) {
  res.render('signup', {title: 'Big Market'});
});

// Signup
router.post('/signup', (req, res) => {
  const {email, username, password} = req.body;

  User.findOne({email: email}).then(user => {
    if (user) {
      res.send('Email already exists');
    } else {
      const newUser = new User({
        email : email,
        username : username,
        password : password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
              .save()
              .then(user => {
                console.log(user);
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
        });
      });
    }
  });
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
