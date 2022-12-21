const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');


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

const validateReviewImage = [
    check('url')
        .notEmpty()
        .withMessage('url must be defined'),
    handleValidationErrors
];


// Get reviews of current user
router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;

    const reviews = await Review.findAll({
        where: {
            userId: userId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                include: [{
                    model: SpotImage,
                    attributes: ['url', 'preview']
                }]
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })

    if (!reviews) {
        return res.json("No reviews for current user")
    }

    let reviewArr = [];
    reviews.forEach(review => {
        let eachReview = review.toJSON();
        // console.log(eachReview.Spot.SpotImages)
        if (eachReview.Spot.SpotImages.length > 0) {
            for (let i = 0; i < eachReview.Spot.SpotImages.length; i++) {
                if (eachReview.Spot.SpotImages[i].preview === true) {
                    eachReview.Spot.previewImage = eachReview.Spot.SpotImages[i].url;
                }
            }
        }

        if (!eachReview.Spot.previewImage) {
            eachReview.Spot.previewImage = "No preview image available";
        }

        if (!eachReview.ReviewImages.length > 0) {
            eachReview.ReviewImages = "No current review images available"
        }

        delete eachReview.Spot.SpotImages
        reviewArr.push(eachReview);
    })

    res.json({
        Reviews: reviewArr
    });
})

// Add an Image to a Review based on the Review's id
router.post("/:reviewId/images", requireAuth, validateReviewImage, async (req, res, next) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const user = req.user

    const review = await Review.findByPk(reviewId)

    const err = {}
    if (!review) {
        err.title = "Couldn't find a Review with the specified id";
        err.message = "Review couldn't be found";
        err.status = 401;
        return next(err)
    };

    if (review.userId !== user.id) {
        err.title = "Authorization error";
        err.status = 403;
        err.message = "Review doesn't belong to current user";
        return next(err);
    }

    let allReviewImages = await review.getReviewImages()

    console.log(allReviewImages.length)

    if (allReviewImages.length >= 10) {
        err.title = "Cannot add any more images because there is a maximum of 10 images per resource";
        err.message = "Maximum number of images for this resource was reached";
        err.status = 403;
        return next(err)
    };

    const newReviewImage = await review.createReviewImage({
        url: url
    });

    res.json(newReviewImage)
})







module.exports = router;
