// backend/routes/api/users.js
const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, validateSignup } = require('../../utils/validation');


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
            err.errors = ["User with that email already exists"]

            return next(err)
        }

        if (checkUserName) {
            err.title = "Validation error"
            err.message = "User already exists";
            err.status = 403;
            err.errors = ["User with that username already exists"]
            return next(err)
        }

        if (!email || !username || !firstName || !lastName) {
            err.title = "Validation error"
            err.message = "Validation error"
            err.status = 400;
            err.errors = [];

            if (!email) {
                err.errors.push("Invalid email")
            }

            if (!username) {
                err.errors.push("Invalid userName")
            }

            if (!firstName) {
                err.errors.push(["Invalid firstName"])
            }

            if (!lastName) {
                err.errors.push(["Invalid lastName"])
            }

            return next(err)
        }


        const user = await User.signup({ email, username, password, firstName, lastName });

        let token = await setTokenCookie(res, user);

        return res.json({
            'user': {
                user
                // firstName: user.firstName,
                // lastName: user.lastName,
                // email: user.email,
                // username: user.username,
                // token: token,
            }
        })
    },
);




module.exports = router;
