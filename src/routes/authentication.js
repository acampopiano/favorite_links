const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
//SIGNUP
router.get('/signup',(req, res) => {
    res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

//SIGNIN
router.get('/signin',(req, res) => {
    res.render('auth/signin')
});

router.post('/signin',(req, res,next) => {
    check('username', 'Username is Required').notEmpty();
    check('password', 'Password is Required').notEmpty();
    const errors = validationResult(req);
    if (errors.length > 0) {
        req.flash('message', errors[0].msg);
        res.redirect('/signin');
    }
    passport.authenticate('local.signin',{ 
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

/*router.post('/signup', passport.authenticate('local.signup'),{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
});*/
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
  });
  router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
  });
module.exports = router;