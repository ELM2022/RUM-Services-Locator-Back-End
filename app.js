// IMPORTING DEPENDENCIES
const express = require('express');
const session = require('express-session');
const cookieSession = require('cookie-session');
// const cookieParser = require('cookie-parser');
const cors = require('cors');
// const passport = require('passport');
const connection = require('./src/configs/db');
const MySQLStore = require('express-mysql-session')(session);
// require('./src/configs/passport');

// IMPORTING ROUTES
const adminRoutes = require('./src/routes/adminRoutes');
const officeRoutes = require('./src/routes/officeRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const pendingAdminRoutes = require('./src/routes/pendingAdminRoutes');
const officeUpdatesRoutes = require('./src/routes/officeUpdatesRoutes');
const adminUpdatesRoutes = require('./src/routes/adminUpdatesRoutes');
const authRoutes = require('./src/routes/authRoutes');

// GENERAL SETUP
const port = process.env.PORT || 3000;
const header = (process.env.NODE_ENV === "production") ? '/' : '/RUMSL';
const config = (process.env.NODE_ENV === "production") ? connection.prodConfig : connection.devConfig;

// CREATING CONNECTION POOL
const pool = connection.pool;

// CREATING EXPRESS APPLICATION
const app = express();
app.enable('trust proxy');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.set('trust proxy', 1);
// app.use(cors());
app.use(cors({
    // origin: (process.env.NODE_ENV === "production") ? "https://rumsl-admin.herokuapp.com" : "http://localhost:3000",
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    // exposedHeaders: ["set-cookie"],
}));

// SESSION SETUP
const sessionStore = new MySQLStore(config);
// app.use(cookieParser());
// app.use(session({
//     secret: process.env.SESS_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: sessionStore,
//     cookie: {
//         httpOnly: (process.env.NODE_ENV === "production") ? true : false,
//         secure: (process.env.NODE_ENV === "production") ? true : false,
//         maxAge: 1000 * 60 * 60 * 24     // one day
//     }
// }));

app.use(cookieSession({
    secret: process.env.SESS_SECRET,
    maxAge: 1000 * 60 * 60 * 24,     // one day
    httpOnly: false,
    secure: false
}));

// SETTING UP AUTHENTICATION
// app.use(passport.initialize());
// app.use(passport.session());

// ADDING ROUTES
app.use(header, adminRoutes);
app.use(header, officeRoutes);
app.use(header, categoryRoutes);
app.use(header, pendingAdminRoutes);
app.use(header, officeUpdatesRoutes);
app.use(header, adminUpdatesRoutes);
app.use(header, authRoutes);

app.use(header, (req, res) => {
    res.send("Welcome to the RUM Services Locator app!");
});

// STARTING UP LOCAL SERVER
app.listen(port, () => {
    console.log(`Server listening on port ${port}!`)
});

module.exports = app;