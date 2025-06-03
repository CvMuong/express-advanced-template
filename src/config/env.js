require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    mongo_uri: process.env.MONGO_URI,
    jwt_secret: process.env.JWT_SECRET,
    jwtrefreshsecret: process.env.JWT_REFRESH_SECRET,
    node_env: process.env.NODE_ENV || 'development',
    // tim hiểu thêm cloudinary
    // tim hiểu thêm về email(gửi email từ server)
}