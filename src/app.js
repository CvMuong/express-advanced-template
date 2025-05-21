const express = require('express');
const userRoutes = require('./routes/user.route');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/db');

const app = express();

connectDB();

if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan');
    app.use(morgan('dev'));
}

app.use(express.json());

app.use('/users', userRoutes);

// Middleware xử lý lỗi
app.use(errorHandler);

module.exports = app