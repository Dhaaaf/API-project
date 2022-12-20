const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');


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

// Get all spots
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

        // console.log(spot)
        // console.log(spot.SpotImages)

        if (spot.SpotImages.length > 0) {
            if (spot.SpotImages[0].dataValues.url) {
                eachSpot.previewImage = spot.SpotImages[0].dataValues.url
            } else {
                eachSpot.previewImage = "No current image listed"
            }
        } else {
            eachSpot.previewImage = "No current image listed"
        }


        spotsArr.push(eachSpot);
    })


    res.json({ Spots: spotsArr });
})

// Get all spots owned by Current User
router.get('/current', requireAuth, async (req, res, next) => {
    let user = req.user;

    let spots = await user.getSpots({
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

    // let spots = await Spot.findAll({
    //     where: {
    //         ownerId: user.id
    //     },
    //     include: [{
    //         model: Review,
    //         attributes: ['stars']
    //     }, {
    //         model: SpotImage,
    //         attributes: ['url']
    //     }]
    // })

    let ownedSpots = [];

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

        if (spot.SpotImages.length > 0) {
            if (spot.SpotImages[0].dataValues.url) {
                eachSpot.previewImage = spot.SpotImages[0].dataValues.url
            } else {
                eachSpot.previewImage = "No current image listed"
            }
        } else {
            eachSpot.previewImage = "No current image listed"
        }

        ownedSpots.push(eachSpot);
    })


    if (ownedSpots.length === 0) {
        res.json("Sorry, you don't own any spots")
    }

    res.json({
        Spots: ownedSpots
    })
})


// Get spot by spotId
router.get('/:spotId', async (req, res, next) => {
    let { spotId } = req.params;

    let spot = await Spot.findByPk(spotId);
    if (!spot) {
        let err = {};
        err.title = "Not found"
        err.response = "Couldn't find a Spot with the specified id"
        err.status = 404;
        err.message = "Spot couldn't be found";
        return next(err);
    }

    spot = spot.toJSON();

    let count = await Review.count({
        where: {
            spotId: spotId
        }
    })
    spot.numReviews = count;

    let sum = await Review.sum('stars', {
        where: {
            spotId: spotId
        }
    })

    if (sum / count) {
        spot.avgStarRating = sum / count;
    }

    let spotImages = await SpotImage.findAll({
        where: {
            spotId: spotId
        },
        attributes: ['id', 'url', 'preview']
    })

    if (spotImages.length > 0) {
        spot.SpotImages = spotImages;
    }

    // let owner = await User.findByPk(spot.ownerId);
    // console.log(owner.toJSON());

    // spot.Owner = {
    //     id: owner.id,
    //     firstName: owner.firstName,
    //     lastName: owner.lastName
    // }

    spot.Owner = await User.findByPk(spot.ownerId, {
        attributes: ['id', 'firstName', 'lastName']
    })

    return res.json(spot)
})




/// Create a spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    let user = req.user;

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    let newSpot = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    return res.json(newSpot)
})

/// Add spotimage to spotId











module.exports = router;
