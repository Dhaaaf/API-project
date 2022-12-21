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
                attributes: ['url', 'preview']
            }
        ]
    })

    let spotsArr = [];

    spots.forEach(spot => {
        // let count = spot.Reviews.length;
        // let sum = 0;
        // spot.Reviews.forEach((review) => sum += review.stars)
        // let avg = sum / count;
        // if (!avg) {
        //     // eachSpot.avgRating = "No current ratings"
        //     avg = "No current ratings"
        // };

        // let eachSpot = {
        //     id: spot.id,
        //     ownerId: spot.ownerId,
        //     address: spot.address,
        //     city: spot.city,
        //     state: spot.state,
        //     country: spot.country,
        //     lat: spot.lat,
        //     lng: spot.lng,
        //     name: spot.name,
        //     description: spot.description,
        //     price: spot.price,
        //     createdAt: spot.createdAt,
        //     updatedAt: spot.updatedAt,
        //     avgRating: avg
        // }

        // // console.log(spot)
        // // console.log(spot.SpotImages)

        // if (spot.SpotImages.length > 0) {
        //     if (spot.SpotImages[0].dataValues.url) {
        //         eachSpot.previewImage = spot.SpotImages[0].dataValues.url
        //     } else {
        //         eachSpot.previewImage = "No current image listed"
        //     }
        // } else {
        //     eachSpot.previewImage = "No current image listed"
        // }
        let eachSpot = spot.toJSON();

        let count = spot.Reviews.length;
        let sum = 0;
        spot.Reviews.forEach((review) => sum += review.stars)
        let avg = sum / count;
        if (!avg) {
            avg = "No current ratings"
        };

        eachSpot.avgRating = avg;

        if (eachSpot.SpotImages.length > 0) {
            for (let i = 0; i < eachSpot.SpotImages.length; i++) {
                if (eachSpot.SpotImages[i].preview === true) {
                    eachSpot.previewImage = eachSpot.SpotImages[i].url;
                }
            }
        }

        if (!eachSpot.previewImage) {
            eachSpot.previewImage = "No preview image available";
        }

        delete eachSpot.Reviews;
        delete eachSpot.SpotImages
        spotsArr.push(eachSpot);
    })

    if (spotsArr.length === 0) {
        res.json("Sorry, no current spots")
    }


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
                attributes: ['url', 'preview']
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
        let eachSpot = spot.toJSON();

        let count = spot.Reviews.length;
        let sum = 0;
        spot.Reviews.forEach((review) => sum += review.stars)
        let avg = sum / count;
        if (!avg) {
            avg = "No current ratings"
        };

        eachSpot.avgRating = avg;

        // let eachSpot = {
        //     id: spot.id,
        //     ownerId: spot.ownerId,
        //     address: spot.address,
        //     city: spot.city,
        //     state: spot.state,
        //     country: spot.country,
        //     lat: spot.lat,
        //     lng: spot.lng,
        //     name: spot.name,
        //     description: spot.description,
        //     price: spot.price,
        //     createdAt: spot.createdAt,
        //     updatedAt: spot.updatedAt,
        //     avgRating: avg
        // }

        // if (spot.SpotImages.length > 0) {
        //     if (spot.SpotImages[0].dataValues.url) {
        //         eachSpot.previewImage = spot.SpotImages[0].dataValues.url
        //     } else {
        //         eachSpot.previewImage = "No current image listed"
        //     }
        // } else {
        //     eachSpot.previewImage = "No current image listed"
        // }

        if (eachSpot.SpotImages.length > 0) {
            for (let i = 0; i < eachSpot.SpotImages.length; i++) {
                if (eachSpot.SpotImages[i].preview === true) {
                    eachSpot.previewImage = eachSpot.SpotImages[i].url;
                }
            }
        }

        if (!eachSpot.previewImage) {
            eachSpot.previewImage = "No preview image available";
        }

        if (!eachSpot.Reviews.length > 0) {
            eachSpot.Reviews = "No current reviews"
        }

        if (!eachSpot.SpotImages.length > 0) {
            eachSpot.SpotImages = "No current SpotImages"
        }

        delete eachSpot.SpotImages
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
    } else {
        spot.avgStarRating = "No current ratings";
    }

    let spotImages = await SpotImage.findAll({
        where: {
            spotId: spotId
        },
        attributes: ['id', 'url', 'preview']
    })

    if (spotImages.length > 0) {
        spot.SpotImages = spotImages;
    } else {
        spot.SpotImages = "No images listed"
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

    res.status = 201;
    return res.json(newSpot)
})

/// Add spotimage to spotId

router.post('/:spotId/images', requireAuth, validateSpotImage, async (req, res, next) => {
    let { spotId } = req.params;
    let { url, preview } = req.body;

    const user = req.user;

    const spot = await Spot.findByPk(spotId);

    let err = {};
    if (!spot) {
        err.title = "Spot couldn't be found"
        err.status = 404;
        err.message = "Spot couldn't be found";
        return next(err);
    }

    if (user.id !== spot.ownerId) {
        err.title = "Authorization error";
        err.status = 403;
        err.message = "Spot doesn't belong to current user";
        return next(err);
    }

    let spotImage = await spot.createSpotImage({
        url: url,
        preview: preview
    })

    res.json({
        id: spotImage.id,
        url: spotImage.url,
        preview: spotImage.preview
    });
})

/// Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {

    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(spotId);
    const user = req.user;

    const err = {};
    if (!spot) {
        err.title = "Spot couldn't be found"
        err.status = 404;
        err.message = "Spot couldn't be found";
        return next(err);
    }

    if (user.id !== spot.ownerId) {
        err.title = "Authorization error";
        err.status = 403;
        err.message = "Spot doesn't belong to current user";
        return next(err);
    }

    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    await spot.save()

    res.json(spot);
})

/// Delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);
    const user = req.user;

    const err = {};
    if (!spot) {
        err.title = "Spot couldn't be found"
        err.status = 404;
        err.message = "Spot couldn't be found";
        return next(err);
    }

    if (user.id !== spot.ownerId) {
        err.title = "Authorization error";
        err.status = 403;
        err.message = "Spot doesn't belong to current user";
        return next(err);
    }

    spot.destroy();
    res.json({
        message: "Successfully deleted",
        statusCode: 200
    })

})


/// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);

    const err = {};
    if (!spot) {
        err.title = "Couldn't find a Spot with the specified id"
        err.status = 404;
        err.message = "Spot couldn't be found";
        return next(err);
    }

    const reviews = await spot.getReviews({
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    let reviewsArr = [];
    reviews.forEach(review => {
        let eachReview = review.toJSON();

        if (!eachReview.ReviewImages.length > 0) {
            eachReview.ReviewImages = "No current review images available"
        }

        reviewsArr.push(eachReview);
    })

    if (!reviewsArr.length) {
        return res.json("No reviews for this spot")
    }


    res.json({
        Reviews: reviewsArr
    });
})

// Create a Review for a spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const { spotId } = req.params;
    const { review, stars } = req.body

    const user = req.user;
    const spot = await Spot.findByPk(spotId);

    const err = {};
    if (!spot) {
        err.title = "Couldn't find a Spot with the specified id"
        err.status = 404;
        err.message = "Spot couldn't be found";
        return next(err);
    }

    let existingReview = await Review.findOne({
        where: {
            spotId: spotId,
            userId: user.id
        }
    })

    if (existingReview) {
        err.title = "Review from the current user already exists for the Spot";
        err.status = 403;
        err.message = "User already has a review for this spot";
        return next(err)
    }

    if (spot.ownerId === user.id) {
        err.title = "User cannot leave review for own spot";
        err.status = 403;
        err.message = "This spot is owned by the current user";
        return next(err)
    }


    const newReview = await spot.createReview({
        userId: user.id,
        review: review,
        stars: stars
    })

    res.status = 201;
    res.json(newReview)
})












module.exports = router;
