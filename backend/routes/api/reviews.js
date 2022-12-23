const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors, validateReview, validateReviewImage } = require('../../utils/validation');
const sequelize = require('sequelize');

const { ifReviewExists, ifUsersReview } = require('../../utils/error-handlers')


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
router.post("/:reviewId/images", requireAuth, ifReviewExists, ifUsersReview, validateReviewImage, async (req, res, next) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const user = req.user

    const review = await Review.findByPk(reviewId)

    let allReviewImages = await review.getReviewImages()

    const err = {}
    if (allReviewImages.length >= 10) {
        err.title = "Cannot add any more images because there is a maximum of 10 images per resource";
        err.message = "Maximum number of images for this resource was reached";
        err.status = 403;
        return next(err)
    };

    const newReviewImage = await review.createReviewImage({
        url: url
    });

    res.json({
        id: newReviewImage.id,
        url: newReviewImage.url
    })
})


/// Edit a Review
router.put('/:reviewId', requireAuth, validateReview, ifReviewExists, ifUsersReview, async (req, res, next) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const user = req.user;

    let editReview = await Review.findByPk(reviewId);

    editReview.review = review;
    editReview.stars = stars;

    await editReview.save();

    return res.json(editReview);
})

/// Delete a review
router.delete('/:reviewId', requireAuth, ifReviewExists, ifUsersReview, async (req, res, next) => {
    const { reviewId } = req.params;
    const user = req.user;

    let review = await Review.findByPk(reviewId);

    review.destroy();

    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})







module.exports = router;
