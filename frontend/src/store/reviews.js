import { csrfFetch } from "./csrf";


const GET_SPOT_REVIEWS = 'spot/GET_REVIEWS'
const GET_USERS_REVIEWS = 'user/GET_SPOTS'
const ADD_REVIEW = 'spot/ADD_REVIEW'
const EDIT_REVIEW = 'review/EDIT_REVIEW'
const DELETE_REVIEW = 'review/DELETE_REVIEW'
const ADD_REVIEW_IMAGE = 'review/ADD_IMAGE'


// Action creators
export const actionGetSpotsReviews = (reviews) => {
    return {
        type: GET_SPOT_REVIEWS,
        reviews
    }
}

export const actionGetUsersReviews = (reviews) => {
    return {
        type: GET_USERS_REVIEWS,
        reviews
    }
}

export const actionAddReview = (review) => {
    return {
        type: ADD_REVIEW,
        review
    }
}

export const actionEditReview = (reviewId, review) => {
    return {
        type: EDIT_REVIEW,
        reviewId,
        review
    }
}

export const actionDeleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        reviewId
    }
}

export const actionAddReviewImage = (reviewId, url) => {
    return {
        type: ADD_REVIEW_IMAGE,
        reviewId,
        url
    }
}








const initialState = {
    spotReviews: {},
    userReviews: {}
}


const normalize = (reviews) => {
    const data = {};

    reviews.Reviews.forEach(review => data[review.id] = review);
    return data;
}


export default function reviewsReducer(state = initialState, action) {
    const newState = { ...state }
    switch (action.type) {
        default:
            return state
    }
}
