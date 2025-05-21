const userServive = require('../services/user.service');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userServive.getUsers();

        if (!users) {
            const error = new Error('No users found');
            error.status = 404;
            return next(error);
        }

        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const { name, age } = req.body;
        const newUser = await userServive.addUser(name, age);

        if (!newUser) {
            const error = new Error('Failed to create user');
            error.status = 400;
            return next(error);
        }

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};