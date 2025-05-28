const config = require('../config/env');

module.exports = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    if (config.node_env === 'development') {
        console.error('Detail error: ', err.stack);
    }

    res.status(status).json({
        success: false,
        message,
        ...(config.node_env === 'development' && { error: err.stack })
    });
}
