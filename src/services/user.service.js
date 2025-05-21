const User = require('../models/user.model');

exports.getUsers = async () => {
    return await User.find();
}

exports.addUser = async (name, age) => {
    const newUser = await User.create({ name, age });
    return newUser;
}