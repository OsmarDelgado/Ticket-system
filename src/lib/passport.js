'use strict'

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('../db');
const helpers = require('../lib/helpers');

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    //console.log(req.body);
    const rows = await db.query('SELECT * FROM sec_users WHERE login = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPasswords(password, user.pswd);
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenido ' + user.name));
        } else {
            done(null, false, req.flash('message', 'Usuario o contraseña incorrectos!'));
        }
    } else {
        return done(null, false, req.flash('message', 'Usuario o contraseña incorrectos!'));
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.login);
});

passport.deserializeUser(async (username, done) => {
    const rows = await db.query('SELECT * FROM sec_users WHERE login = ?', [username]);
    done(null, rows[0]);
});