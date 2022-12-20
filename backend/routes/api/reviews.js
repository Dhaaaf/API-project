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
        console.log(eachReview.Spot.SpotImages)
        if (eachReview.Spot.SpotImages.length > 0) {
            for (let i = 0; i < eachReview.Spot.SpotImages.length; i++) {
                if (eachReview.Spot.SpotImages[i].preview === true) {
                    eachReview.Spot.previewImage = eachReview.Spot.SpotImages[i];
                }
            }
        }

        if (!eachReview.Spot.previewImage) {
            eachReview.Spot.previewImage = "No preview image available";
            delete eachReview.Spot.SpotImages
            reviewArr.push(eachReview);
        }
    })

    res.json({
        Reviews: reviewArr
    });
})







module.exports = router;
