var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var User = require('../models/user');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next){
    console.log("session USER_ID: " + req.session.user_id);
    User.findById(req.session.user_id, function(err,user) {
        if(err) {
            console.log("View user Profile error: "+err);
        } else{
            res.render('user/profile', {data:user});
        }
    });
   
});

router.get('/logout', isLoggedIn, function (req, res, next){
    req.logout();
    req.session.destroy(function(err) {
        console.log("LOGGED OUT");
    })
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/signup', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length> 0
    });
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/signin', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length> 0
    });
});

router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}