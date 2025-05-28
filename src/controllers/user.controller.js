const userService = require('../services/user.service');
const User = require('../models/account.model');

const handleError = (message, status = 401) => {
    const error = new Error(message);
    error.status = status;
    return error;
}

exports.getAllUsers = async (req, res, next) => {
    try {
        // const users = await userService.getUsers();
        const users = await User.find().select('-password');

        if (users.length === 0) {
            return next(handleError('No users found!', 404));
        }

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        next(error);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const { name, age } = req.body;
        const newUser = await userService.addUser(name, age);

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

exports.deleteUserById = async (req, res, next) => {
    try {
        const user = await User.findById({ _id: req.params.id });

        if (!user) {
            return next(handleError('User not found!', 404));
        }

        await User.findOneAndDelete({ _id: req.params.id });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        })
    } catch {
        return next(handleError('Something went wrong while deleting user', 500));
    }
}

exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return next(handleError('Invalid role', 400));
        }

        if (req.account.id === req.params.id) {
            return next(handleError("You can't change your own role", 400));
        }

        const user = await User.findOneAndUpdate(
            { _id: req.params.id },
            { roles: role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) { 
            return next(handleError('User not found', 400));
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        next(error);
    }
}