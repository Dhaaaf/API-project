const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const sequelize = require('sequelize');

// Delete a review Image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const user = req.user

    const image = await ReviewImage.findByPk(imageId);

    const err = {};

    /// If review image exists
    if (!image) {
        err.title = "Couldn't find a Review Image with the specified id";
        err.status = 404;
        err.message = "Review Image couldn't be found"
        return next(err)
    };

    const review = await image.getReview();
    /// If review belongs to user
    if (user.id !== review.userId) {
        err.title = "Authorization error";
        err.status = 403;
        err.message = "Cannot delete image from review not left by user"
        return next(err)
    };

    image.destroy();
    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})




module.exports = router;
