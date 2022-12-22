// backend/utils/validation.js
const { check } = require('express-validator');
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors
            .array()
            .map((error) => `${error.msg}`);

        const err = Error('Bad request.');
        err.errors = errors;
        err.status = 400;
        err.title = 'Bad request.';
        next(err);
    }
    next();
};

const validateSpot = [
    check('address')
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .notEmpty()
        .withMessage('Country is required'),
    check('lat', "Latitude is not valid")
        .notEmpty()
        .bail()
        .isDecimal()
        .withMessage('Latitude is not valid'),
    check('lng', "Longitude is not valid")
        .notEmpty()
        .bail()
        .isDecimal()
        .withMessage('Longitude is not valid'),
    check('name')
        .notEmpty()
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .notEmpty()
        .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateReview = [
    check('review')
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .notEmpty()
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];


const validateBooking = [
    check('startDate')
        .notEmpty()
        .isDate()
        .withMessage('Start date must be a date'),
    check('endDate')
        .notEmpty()
        .isDate()
        .withMessage('End date must be a date and cannot be on or before start date'),
    handleValidationErrors
];

const validateSpotImage = [
    check('url')
        .notEmpty()
        .withMessage('url must be defined'),
    check('preview')
        .notEmpty()
        .isBoolean()
        .withMessage('preview must be a boolean value'),
    handleValidationErrors
];

const validateQuery = [
    check("page")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Page must be greater than or equal to 1"),
    check("size")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("Size must be greater than or equal to 1"),
    check("maxLat")
        .optional({ nullable: true })
        .isDecimal()
        .withMessage("Maximum latitude is invalid"),
    check("minLat")
        .optional({ nullable: true })
        .isDecimal()
        .withMessage("Minimum latitude is invalid"),
    check("maxLng")
        .optional({ nullable: true })
        .isDecimal()
        .withMessage("Maximum longitude is invalid"),
    check("minLng")
        .optional({ nullable: true })
        .isDecimal()
        .withMessage("Minimum longitude is invalid"),
    check("minPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Minimum price must be greater or equal to 0"),
    check("maxPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Maximum price must be greater or equal to 0"),
    handleValidationErrors
];

const validateReviewImage = [
    check('url')
        .notEmpty()
        .withMessage('url must be defined'),
    handleValidationErrors
];

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
        .exists({ checkFalsey: true })
        .withMessage('Must provide a firstName'),
    check('lastName')
        .exists({ checkFalsey: true })
        .withMessage('Must provide a lastName'),
    handleValidationErrors
];


module.exports = {
    handleValidationErrors,
    validateSpot,
    validateReview,
    validateBooking,
    validateSpotImage,
    validateQuery,
    validateReviewImage,
    validateSignup
};
