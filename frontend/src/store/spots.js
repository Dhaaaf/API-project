import { csrfFetch } from "./csrf";


const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';
const GET_USERS_SPOTS = 'spots/GET_USERS_SPOTS';
const GET_SINGLE_SPOT = 'spots/GET_SINGLE_SPOT'
const ADD_SPOT = 'spots/ADD_SPOT'
const EDIT_SPOT = 'spots/EDIT_SPOT'
const DELETE_SPOT = 'spots/DELETE_SPOT'
const ADD_PREVIEW_IMAGE = "spots/addPreviewImage";
const ADD_SPOT_IMAGE = "spots/addSpotImage"


// Action creators
export const actionGetAllSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
}

export const actionGetUserSpots = (spots) => {
    return {
        type: GET_USERS_SPOTS,
        spots
    }
}

export const actionGetSingleSpot = (spot) => {
    return {
        type: GET_SINGLE_SPOT,
        spot
    }
}

export const actionAddSpot = (spot) => {
    return {
        type: ADD_SPOT,
        spot
    }
}

export const actionEditSpot = (spotId, spot) => {
    return {
        type: EDIT_SPOT,
        spotId,
        spot
    }
}

export const actionDeleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
    }
}

export const actionAddPreviewImg = (spotId, url, preview) => {
    return {
        type: ADD_PREVIEW_IMAGE,
        spotId,
        url,
        preview
    }
}

export const actionAddSpotImg = (spotId, url, preview) => {
    return {
        type: ADD_SPOT_IMAGE,
        spotId,
        url,
        preview
    }
}




// Thunks
export const thunkGetAllSpots = () => async (dispatch) => {
    const res = await csrfFetch("/api/spots")
    if (res.ok) {
        const spots = await res.json();
        dispatch(actionGetAllSpots(spots));
        return spots;
    }
}

export const thunkGetUsersSpots = () => async (dispatch) => {
    const res = await csrfFetch("/api/spots/current")

    if (res.ok) {
        const spots = await res.json();
        dispatch(actionGetAllSpots(spots));
        return spots;
    }
}

export const thunkGetSingleSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`)

    if (res.ok) {
        const spot = await res.json();
        dispatch(actionGetSingleSpot(spot))
        return spot;
    }
}

export const thunkAddSpot = (spot) => async (dispatch) => {
    const res = await csrfFetch("/api/spots", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    })

    if (res.ok) {
        const spot = await res.json();
        dispatch(actionAddSpot(spot));
        return spot;
    }
}

export const thunkEditSpot = (spotId, spot) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(spot)
    })

    if (res.ok) {
        const spot = await res.json();
        dispatch(actionEditSpot(spotId, spot));
        return spot;
    }
}

export const thunkDeleteSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })

    if (res.ok) {
        const spot = await (res.json());
        dispatch(actionDeleteSpot(+spot.id))
        return spot
    }
}

export const thunkAddPreviewImg = (spotId, url, preview) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url,
            preview
        })
    })

    if (res.ok) {
        const { spotId, url, preview } = await (res.json());
        dispatch(actionAddPreviewImg(+spotId, url, preview))
        return spotId
    }
}

export const thunkAddSpotImg = (spotId, url, preview) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url,
            preview
        })
    })

    if (res.ok) {
        const { spotId, url, preview } = await (res.json());
        dispatch(actionAddPreviewImg(+spotId, url, preview))
        return spotId
    }
}





const initialState = {
    spots: {},
    singleSpot: {}
}


const normalize = (spots) => {
    const data = {};
    if (spots.Spots) {
        spots.Spots.forEach(spot => data[spot.id] = spot);
        return data;
    }
}


export default function spotReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            const newState = { ...state }
            newState.spots = normalize(action.spots)
            return newState
        }
        case GET_USERS_SPOTS: {
            const newState = { ...state }
            newState.spots = normalize(action.spots)
            return newState
        }
        case GET_SINGLE_SPOT: {
            const newState = { ...state }
            newState.singleSpot = action.spot
            return newState
        }
        case ADD_SPOT: {
            const newState = { ...state }
            newState.spots = { ...state.spots, [action.spot.id]: action.spot }
            return newState
        }
        case EDIT_SPOT: {
            const newState = { ...state }
            newState.spots = { ...state.spots, [action.spotId]: action.spot }
            newState.singleSpot = { ...state.singleSpot, ...action.spot }
            return newState
        }
        case DELETE_SPOT: {
            const newState = { ...state }
            delete newState.spots[action.spotId]
            return newState
        }
        case ADD_PREVIEW_IMAGE: {
            const newState = { ...initialState }
            newState.spots = { ...state.spots, [action.spotId.previewImage]: action.url }
            return newState
        }
        case ADD_SPOT_IMAGE: {
            const newState = { ...state }
            newState.singleSpot = { ...state.singleSpot, [action.spotId.SpotImages]: [action.spotId.SpotImages].push(action.url) }
            return newState
        }
        default:
            return state;
    }
}
