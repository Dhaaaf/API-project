import { csrfFetch } from "./csrf";


const GET_SPOT_REVIEWS = 'spot/GET_REVIEWS'
const GET_USERS_REVIEWS = 'user/GET_SPOTS'
const ADD_REVIEW = 'spot/ADD_REVIEW'
const EDIT_REVIEW = 'review/EDIT_REVIEW'
const DELETE_REVIEW = 'review/DELETE_REVIEW'
const ADD_REVIEW_IMAGE = 'review/ADD_IMAGE'
const RESET_REVIEWS = 'review/RESET_REVIEWS'


// Action creators
export const actionGetSpotsReviews = (spotId, reviews) => {
    return {
        type: GET_SPOT_REVIEWS,
        spotId,
        reviews
    }
}

export const actionGetUsersReviews = (userId, reviews) => {
    return {
        type: GET_USERS_REVIEWS,
        reviews
    }
}

export const actionAddReview = (spotId, review) => {
    return {
        type: ADD_REVIEW,
        spotId,
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

export const actionResetReviews = () => {
    return {
        type: RESET_REVIEWS
    }
}

// export const actionAddReviewImage = (reviewId, url) => {
//     return {
//         type: ADD_REVIEW_IMAGE,
//         reviewId,
//         url
//     }
// }


// Thunks

export const thunkGetSpotReviews = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (res.ok) {
        const reviews = await res.json()
        dispatch(actionGetSpotsReviews(spotId, reviews));
        return reviews
    }
}

export const thunkGetUserReviews = (userId) => async (dispatch) => {
    const res = await csrfFetch("/api/reviews/current");

    if (res.ok) {
        const reviews = await res.json();
        dispatch(actionGetUsersReviews(userId, reviews));
        return reviews;
    }
}

export const thunkAddReview = (spotId, review) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review)
    })

    if (res.ok) {
        const review = await res.json();
        dispatch(actionAddReview(spotId, review));
        return review;
    }
}

export const thunkDeleteReview = (reviewId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    })

    if (res.ok) {
        const deletedReview = await res.json();
        dispatch(actionDeleteReview(reviewId));
        return deletedReview;
    }
}

export const thunkEditReview = (reviewId, review) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review)
    })

    if (res.ok) {
        const editedReview = await res.json();
        dispatch(actionEditReview(reviewId, review));
        return editedReview;
    }
}


const initialState = {
    spotReviews: {},
    userReviews: {}
}


const normalize = (reviews) => {
    const data = {};
    reviews.forEach(review => data[review.id] = review);
    return data;
}


export default function reviewsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_SPOT_REVIEWS: {
            const newState = { ...state }
            if (action.reviews.Reviews) {
                newState.spotReviews = normalize(action.reviews.Reviews)
                return newState
            } else {
                return { ...state, spotReviews: null }
            };
        }
        case GET_USERS_REVIEWS: {
            const newState = { ...state }
            if (action.reviews.Reviews) {
                newState.userReviews = normalize(action.reviews.Reviews)
                return newState
            } else {
                return { ...state, userReviews: null }
            };
        }
        case ADD_REVIEW: {
            const newState = { ...state }
            newState.spotReviews = { ...state.spotReviews, [action.review.id]: action.review }
            newState.userReviews = { ...state.userReviews, [action.review.id]: action.review }
            return newState
        }
        case DELETE_REVIEW: {
            const newState = { ...state }
            delete newState.spotReviews[action.reviewId]
            delete newState.userReviews[action.reviewId]
            return newState
        }
        case EDIT_REVIEW: {
            const newState = { ...state }
            newState.spotReviews = { ...state.spotReviews, [action.reviewId]: action.review }
            newState.userReviews = { ...state.userReviews, [action.reviewId]: action.review }
            return newState
        }
        default:
            return state
    }
}
