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
const { ifSpotExists, ifUsersSpot, convertDate } = require('../../utils/error-handlers')

const sequelize = require('sequelize');
const { Op } = require('sequelize');


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


    res.json({
        Spots: spotsArr,
        page: page,
        size: size
    });
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

        delete eachSpot.SpotImages;
        delete eachSpot.Reviews;
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
router.get('/:spotId', ifSpotExists, async (req, res, next) => {
    let { spotId } = req.params;

    let spot = await Spot.findByPk(spotId);

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
router.post('/:spotId/images', requireAuth, ifSpotExists, ifUsersSpot, validateSpotImage, async (req, res, next) => {
    let { spotId } = req.params;
    let { url, preview } = req.body;

    const user = req.user;

    const spot = await Spot.findByPk(spotId);

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
router.put('/:spotId', requireAuth, ifSpotExists, ifUsersSpot, validateSpot, async (req, res, next) => {

    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(spotId);
    const user = req.user;

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
router.delete('/:spotId', requireAuth, ifSpotExists, ifUsersSpot, async (req, res, next) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);
    const user = req.user;

    spot.destroy();
    res.json({
        message: "Successfully deleted",
        statusCode: 200
    })
})


/// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', ifSpotExists, async (req, res, next) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId);

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
router.post('/:spotId/reviews', requireAuth, ifSpotExists, validateReview, async (req, res, next) => {
    const { spotId } = req.params;
    const { review, stars } = req.body

    const user = req.user;
    const spot = await Spot.findByPk(spotId);


    let existingReview = await Review.findOne({
        where: {
            spotId: spotId,
            userId: user.id
        }
    })

    const err = {};
    /// If Review exists
    if (existingReview) {
        err.title = "Review from the current user already exists for the Spot";
        err.status = 403;
        err.message = "User already has a review for this spot";
        return next(err)
    }

    // If Spot belongs to current owner
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
router.get('/:spotId/bookings', requireAuth, ifSpotExists, async (req, res, next) => {
    const { spotId } = req.params;
    const user = req.user;

    const spot = await Spot.findByPk(spotId);

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
    })

    res.json({
        Bookings: bookingsArr
    })
})


/// Create a Booking
router.post('/:spotId/bookings', requireAuth, ifSpotExists, validateBooking, async (req, res, next) => {
    const { spotId } = req.params;
    const user = req.user;
    let { startDate, endDate } = req.body;
    startDate = convertDate(startDate);
    endDate = convertDate(endDate);


    const spot = await Spot.findByPk(spotId);

    const err = {}

    if (startDate <= new Date()) {
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
        err.status = 403;
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
    };
})














module.exports = router;
