// IMPORTING DEPENDENCIES
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const connection = require('./src/configs/db');
const MySQLStore = require('express-mysql-session')(session);
require('./src/configs/passport');

// IMPORTING ROUTES
const buildingRoutes = require('./src/routes/buildingRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const officeRoutes = require('./src/routes/officeRoutes');
const pendingAdminRoutes = require('./src/routes/pendingAdminRoutes');
const officeUpdatesRoutes = require('./src/routes/officeUpdatesRoutes');
const adminUpdatesRoutes = require('./src/routes/adminUpdatesRoutes');
const authRoutes = require('./src/routes/authRoutes');
const testRoutes = require('./src/routes/testRoutes');

// GENERAL SETUP
require('dotenv').config();
const port = process.env.PORT || 3000;

// CREATING CONNECTION POOL
const pool = connection.pool;

// CREATING EXPRESS APPLICATION
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// SESSION SETUP
const sessionStore = new MySQLStore(connection.devConfig);
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24     // one day
    }
}));

// SETTING UP AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//     console.log(req);
//     next();
// });

// ADDING ROUTES
app.use('/RUMSL', buildingRoutes);
app.use('/RUMSL', adminRoutes);
app.use('/RUMSL', officeRoutes);
app.use('/RUMSL', pendingAdminRoutes);
app.use('/RUMSL', officeUpdatesRoutes);
app.use('/RUMSL', adminUpdatesRoutes);
app.use('/RUMSL', authRoutes);
app.use('/RUMSL', testRoutes);

// STARTING UP LOCAL SERVER
app.listen(port, () => {
    console.log(`Server listening on port ${port}!`)
});

module.exports = app;