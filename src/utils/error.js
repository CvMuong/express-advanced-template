
const createError = (message, status = 401) => {
    const error = new Error(message);
    error.status = status;
    return error;
}

module.exports = { createError };