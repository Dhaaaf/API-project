const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');

const {
    handleValidationErrors,
    validateSpot,
    validateReview,
    validateBooking,
    validateSpotImage,
    validateQuery
} = require('../../utils/validation');


const sequelize = require('sequelize');

const { Op } = require('sequelize');


// const validateSpot = [
//     check('address')
//         .notEmpty()
//         .withMessage('Street address is required'),
//     check('city')
//         .notEmpty()
//         .withMessage('City is required'),
//     check('state')
//         .notEmpty()
//         .withMessage('State is required'),
//     check('country')
//         .notEmpty()
//         .withMessage('Country is required'),
//     check('lat', "Latitude is not valid")
//         .notEmpty()
//         .bail()
//         .isDecimal()
//         .withMessage('Latitude is not valid'),
//     check('lng', "Longitude is not valid")
//         .notEmpty()
//         .bail()
//         .isDecimal()
//         .withMessage('Longitude is not valid'),
//     check('name')
//         .notEmpty()
//         .isLength({ max: 50 })
//         .withMessage('Name must be less than 50 characters'),
//     check('description')
//         .notEmpty()
//         .withMessage('Description is required'),
//     check('price')
//         .notEmpty()
//         .withMessage('Price per day is required'),
//     handleValidationErrors
// ];

// const validateReview = [
//     check('review')
//         .notEmpty()
//         .withMessage('Review text is required'),
//     check('stars')
//         .notEmpty()
//         .isInt({ min: 1, max: 5 })
//         .withMessage('Stars must be an integer from 1 to 5'),
//     handleValidationErrors
// ];


// const validateBooking = [
//     check('startDate')
//         .notEmpty()
//         .isDate()
//         .withMessage('Start date must be a date'),
//     check('endDate')
//         .notEmpty()
//         .isDate()
//         .withMessage('End date must be a date and cannot be on or before start date'),
//     handleValidationErrors
// ];

// const validateSpotImage = [
//     check('url')
//         .notEmpty()
//         .withMessage('url must be defined'),
//     check('preview')
//         .notEmpty()
//         .isBoolean()
//         .withMessage('preview must be a boolean value'),
//     handleValidationErrors
// ];

// const validateQuery = [
//     check("page")
//         .optional({ nullable: true })
//         .isInt({ min: 1 })
//         .withMessage("Page must be greater than or equal to 1"),
//     check("size")
//         .optional({ nullable: true })
//         .isInt({ min: 1 })
//         .withMessage("Size must be greater than or equal to 1"),
//     check("maxLat")
//         .optional({ nullable: true })
//         .isDecimal()
//         .withMessage("Maximum latitude is invalid"),
//     check("minLat")
//         .optional({ nullable: true })
//         .isDecimal()
//         .withMessage("Minimum latitude is invalid"),
//     check("maxLng")
//         .optional({ nullable: true })
//         .isDecimal()
//         .withMessage("Maximum longitude is invalid"),
//     check("minLng")
//         .optional({ nullable: true })
//         .isDecimal()
//         .withMessage("Minimum longitude is invalid"),
//     check("minPrice")
//         .optional()
//         .isFloat({ min: 0 })
//         .withMessage("Minimum price must be greater or equal to 0"),
//     check("maxPrice")
//         .optional()
//         .isFloat({ min: 0 })
//         .withMessage("Maximum price must be greater or equal to 0"),
//     handleValidationErrors
// ]

// Get all spots
router.get('/', validateQuery, async (req, res, next) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

    page = Number(page)
    size = Number(size);

    if (!page) page = 1
    if (!size) size = 20
    if (page > 10) page = 10;
    if (size > 20) size = 20;

    let pagination = {}
    if (parseInt(page) >= 1 && parseInt(size) >= 1) {
        pagination.limit = size
        pagination.offset = size * (page - 1)
    }

    const query = {
        where: {},
        include: [
            {
                model: Review,
                attributes: ['stars']
            },
            {
                model: SpotImage,
                attributes: ['url', 'preview']
            }
        ],
        ...pagination,
    };

    // Latitude query

    if (maxLat && !minLat) {
        query.where.lat = {
            [Op.lte]: maxLat
        }
    };

    if (!maxLat && minLat) {
        query.where.lat = {
            [Op.gte]: minLat
        }
    };

    if (maxLat && minLat) {
        query.where.lat = {
            [Op.and]: {
                [Op.lte]: maxLat,
                [Op.gte]: minLat
            }
        }
    };

    // Longitude Query

    if (maxLng && !minLng) {
        query.where.lng = {
            [Op.lte]: maxLng
        }
    };

    if (!maxLng && minLng) {
        query.where.lng = {
            [Op.gte]: minLng
        }
    };

    if (maxLng && minLng) {
        query.where.lng = {
            [Op.and]: {
                [Op.lte]: maxLng,
                [Op.gte]: minLng
            }
        }
    };

    // Price Query

    if (maxPrice && !minPrice) {
        query.where.price = {
            [Op.lte]: maxPrice
        }
    };

    if (!maxPrice && minPrice) {
        query.where.price = {
            [Op.gte]: minPrice
        }
    };

    if (maxPrice && minPrice) {
        query.where.price = {
            [Op.and]: {
                [Op.lte]: maxPrice,
                [Op.gte]: minPrice
            }
        }
    };

    let spots = await Spot.findAll(query);


    // let spots = await Spot.findAll({
    //     include: [
    //         {
    //             model: Review,
    //             attributes: ['stars']
    //         },
    //         {
    //             model: SpotImage,
    //             attributes: ['url', 'preview']
    //         }
    //     ],
    //     ...pagination
    // })

    let spotsArr = [];

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

    // If Spot exists

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

    /// If Spot exists
    let err = {};
    if (!spot) {
        err.title = "Spot couldn't be found"
        err.status = 404;
        err.message = "Spot couldn't be found";
        return next(err);
    }

    /// If Spot belongs to user
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

    /// If Spot Exists
    if (!spot) {
        err.title = "Spot couldn't be found"
        err.status = 404;
        err.message = "Spot couldn't be found";
        return next(err);
    }

    /// If Spot belongs to user
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

    /// If spot exists
    if (!spot) {
        err.title = "Spot couldn't be found"
        err.status = 404;
        err.message = "Spot couldn't be found";
        return next(err);
    }

    /// If spot belongs to user
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

    /// If Spot exists
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

    /// If spot exists
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

    /// If Review exists
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

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const user = req.user;

    const spot = await Spot.findByPk(spotId);

    const err = {};

    /// If Spot exists
    if (!spot) {
        err.title = "Couldn't find a Spot with the specified id"
        err.status = 404;
        err.message = "Spot couldn't be found";
        return next(err);
    };


    let bookings = await spot.getBookings({
        include: {
            model: User,
            attributes: ["id", "firstName", "lastName"]
        }
    });

    if (!bookings.length > 0) {
        return res.json({
            message: "No bookings for current spot"
        })
    }

    const bookingsArr = [];
    bookings.forEach(booking => {
        booking = booking.toJSON();
        if (user.id !== spot.ownerId) {
            let eachBooking = {
                spotId: booking.spotId,
                startDate: booking.startDate,
                endDate: booking.endDate
            };
            bookingsArr.push(eachBooking);
        } else {
            let eachBooking = {
                User: booking.User,
                spotId: booking.spotId,
                userId: booking.userId,
                startDate: booking.startDate,
                endDate: booking.endDate,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            };
            bookingsArr.push(eachBooking);
        }
        // bookingsArr.push(eachBooking);
    })

    res.json({
        Bookings: bookingsArr
    })
})

/// Convert Date helper function
const convertDate = (date) => {
    const [year, month, day] = date.split("-");
    const monthIndex = month - 1;
    const newDate = new Date(year, monthIndex, date)
    return date;
}


/// Create a Booking
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
    const { spotId } = req.params;
    const user = req.user;
    let { startDate, endDate } = req.body;
    startDate = convertDate(startDate);
    endDate = convertDate(endDate);


    const spot = await Spot.findByPk(spotId);

    const err = {}

    if (startDate.getTime() <= new Date()) {
        err.title = "Can't make a booking in the past";
        err.statusCode = 403;
        err.message = "Start date cannot be before today";
        return next(err)
    }

    if (endDate <= startDate) {
        err.title = "Validation error";
        err.statusCode = 400;
        err.message = "End date cannot be on or before start Date";
        return next(err);
    };

    /// If Spot exists
    if (!spot) {
        err.title = "Couldn't find a Spot with the specified id"
        err.status = 404;
        err.message = "Spot couldn't be found";
        return next(err);
    };

    /// Owner can't make booking on own spot
    if (user.id === spot.ownerId) {
        err.title = "Owner can't make booking for owned spot";
        err.status = 403;
        err.message = "Current user owns this spot";
        return next(err);
    };

    const bookings = await spot.getBookings();

    bookings.forEach(booking => {
        booking = booking.toJSON();
        err.title = "Booking Conflict";
        err.statusCode = 403;
        err.message = "Sorry, this spot is already booked for the specified dates";

        bookedStartDate = convertDate(booking.startDate);
        bookedEndDate = convertDate(booking.endDate);

        if ((bookedStartDate <= startDate) && bookedEndDate >= startDate) {
            err.errors = [
                { startDate: "Start date conflicts with an existing booking" }
            ]
            return next(err);
        } else if (((bookedStartDate <= endDate) && (endDate <= bookedEndDate))) {
            err.errors = [
                { endDate: "End date conflicts with an existing booking" }
            ]
            return next(err);
        } else if ((bookedStartDate >= startDate) && (bookedEndDate <= endDate)) {
            err.errors = [
                { startDate: "Start date conflicts with an existing booking" },
                { endDate: "End date conflicts with an existing booking" }
            ]
            return next(err);
        }


    });

    if (!err.errors) {
        let newBooking = await spot.createBooking({
            userId: user.id,
            startDate: startDate,
            endDate: endDate
        })
        return res.json(newBooking)
    }
})














module.exports = router;
