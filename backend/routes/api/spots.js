const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');


const validateSpots = [
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
    check('lat')
        .notEmpty()
        .isDecimal()
        .withMessage('Latitude is not valid'),
    check('lng')
        .notEmpty()
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

const validateReviews = [
    check('review')
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .notEmpty()
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

const validateBookings = [
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

//get all spots
router.get('/', async (req, res, next) => {

    let spots = await Spot.findAll({
        include: [
            {
                model: Review,
                attributes: ['stars']
            },
            {
                model: SpotImage,
                attributes: ['url']
            }
        ]
    })

    let spotsArr = [];

    spots.forEach(spot => {
        let count = spot.Reviews.length;
        let sum = 0;
        spot.Reviews.forEach((review) => sum += review.stars)
        let avg = sum / count;
        if (!avg) {
            // eachSpot.avgRating = "No current ratings"
            avg = "No current ratings"
        };

        let eachSpot = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: avg
        }

        if (spot.SpotImages[0].dataValues.url) {
            eachSpot.previewImage = spot.SpotImages[0].dataValues.url
        } else {
            eachSpot.previewImage = "No current image listed"
        }

        spotsArr.push(eachSpot);
    })


    res.json({ Spots: spotsArr });
})


module.exports = router;
