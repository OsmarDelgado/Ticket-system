'use strict'

const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const mysqlstore = require('express-mysql-session');
const { database } = require('./keys');

// Initializations
const app = express();
require('./lib/passport');

// Settings
const PORT = process.env.PORT || 8080;
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars'),
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: false,
    store: new mysqlstore(database),
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/auth'));
app.use('/tickets', require('./routes/tickets'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Manifest
app.get('/manifest.json', function (req, res) {
    res.header("Content-Type", "text/cache-manifest");
    res.sendFile(path.join(__dirname, "manifest.json"));
});

// Service Worker
app.get('/sw.js', function (req, res) {
    //send the correct headers
    res.header("Content-Type", "text/javascript");

    res.sendFile(path.join(__dirname, "sw.js"));
});

app.get('/app.js', function (req, res) {
    //send the correct headers
    res.header("Content-Type", "text/javascript");

    res.sendFile(path.join(__dirname, "app.js"));
});

// Starting server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});