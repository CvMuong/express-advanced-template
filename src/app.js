const express = require('express');
const cookieParser = require('cookie-parser');
const config = require('./config/env');
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/db');

const app = express();

connectDB();

if (config.node_env === 'development') {
    const morgan = require('morgan');
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser);

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// Middleware xử lý lỗi
app.use(errorHandler);

module.exports = app