// backend/routes/api/users.js
const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');



const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({ checlFalsey: true })
        .withMessage('Must provide a firstName'),
    check('lastName')
        .exists({ checlFalsey: true })
        .withMessage('Must provide a lastName'),
    handleValidationErrors
];


//Sign up
router.post(
    '/',
    validateSignup,
    async (req, res, next) => {
        const { email, password, username, firstName, lastName } = req.body;

        let checkUserName = await User.findOne({
            where: {
                username: username
            }
        });

        let checkEmail = await User.findOne({
            where: {
                email: email
            }
        });

        const err = {}

        if (checkEmail) {
            err.title = "Validation error"
            err.message = "User already exists";
            err.status = 403;
            err.errors = {
                "email": "User with that email already exists"
            }
            return next(err)
        }

        if (checkUserName) {
            err.title = "Validation error"
            err.message = "User already exists";
            err.status = 403;
            err.errors = {
                username: "User with that username already exists"
            }
            return next(err)
        }

        if (!email || !username || !firstName || !lastName) {
            err.title = "Validation error"
            err.message = "Validation error"
            err.status = 400;
            err.errors = [];

            if (!email) {
                err.errors.push({ email: "Invalid email" })
            }

            if (!username) {
                err.errors.push({ email: "Invalid userName" })
            }

            if (!firstName) {
                err.errors.push({ email: "Invalid firstName" })
            }

            if (!lastName) {
                err.errors.push({ email: "Invalid lastName" })
            }

            return next(err)
        }


        const user = await User.signup({ email, username, password, firstName, lastName });

        await setTokenCookie(res, user);

        return res.json({
            user: user
        });
    }
);




module.exports = router;
