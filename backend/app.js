require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    next();
});
app.use(express.json());

// Routes
app.use('/api/auth/', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
