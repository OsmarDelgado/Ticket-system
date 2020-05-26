'use strict'

const express = require( 'express' );
const router = express.Router();
const passport = require( 'passport' );
const { isNotLoggedIn, isLoggedIn } = require( '../lib/auth' );

router.get( '/login', isLoggedIn, (req, res) => {
    res.render('auth/login');
} );

router.post( '/login', isLoggedIn, (req, res, next) => {
    passport.authenticate( 'local.login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true,
    } )(req, res, next);
} );

router.get( '/profile', isNotLoggedIn, (req, res) => {
    res.render('profile');
} );

router.get( '/logout', (req, res) => {
    req.logOut();
    res.redirect( '/login' );
} );


module.exports = router;