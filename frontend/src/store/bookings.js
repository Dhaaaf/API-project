import { csrfFetch } from "./csrf";


const GET_USER_BOOKINGS = "bookings/GET_USER_BOOKINGS";
const GET_SPOT_BOOKINGS = "bookings/GET_SPOT_BOOKINGS";
const ADD_BOOKING = "bookings/ADD_BOOKING";
const EDIT_BOOKING = "bookings/EDIT_BOOKING";
const DELETE_BOOKING = "bookings/DELETE_BOOKING";

// actions
export const actionGetUserBookings = (userId, bookings) => {
    return {
        type: GET_USER_BOOKINGS,
        userId,
        bookings
    }
}

export const actionGetSpotBookings = (spotId, bookings) => {
    return {
        type: GET_SPOT_BOOKINGS,
        spotId,
        bookings
    }
}

export const actionAddBooking = (spotId, booking) => {
    return {
        type: ADD_BOOKING,
        spotId,
        booking
    }
}

export const actionEditBooking = (bookingId, booking) => {
    return {
        type: EDIT_BOOKING,
        bookingId,
        booking
    }
}

export const actionDeleteBooking = (bookingId) => {
    return {
        type: DELETE_BOOKING,
        bookingId
    }
}


// thunks
export const thunkGetUserBookings = (userId) => async (dispatch) => {
    const res = await csrfFetch("/api/bookings/current");

    if (res.ok) {
        const bookings = await res.json();
        dispatch(actionGetUserBookings(userId, bookings));
        return bookings;
    }
}

export const thunkGetSpotBookings = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/bookings`);

    if (res.ok) {
        const bookings = await res.json();
        dispatch(actionGetSpotBookings(spotId, bookings));
        return bookings;
    }
}

export const thunkAddBooking = (spotId, booking) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
    })

    if (res.ok) {
        const newBooking = await res.json();
        dispatch(actionAddBooking(spotId, newBooking))
        return newBooking;
    }
}

export const thunkEditBooking = (bookingId, booking) => async (dispatch) => {
    const res = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
    })

    if (res.ok) {
        const editedBooking = await res.json();
        dispatch(actionEditBooking(bookingId, editedBooking))
        return editedBooking;
    }
}

export const thunkDeleteBooking = (bookingId) => async (dispatch) => {
    const res = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: "DELETE"
    })

    if (res.ok) {
        const deletedBooking = await res.json();
        dispatch(actionDeleteBooking(bookingId));
        return deletedBooking;
    }
}



const normalize = (bookings) => {
    const normalizedData = {};
    bookings.forEach(booking => normalizedData[booking.id] = booking);

    return normalizedData;
}

const initialState = {
    spot: {},
    user: {}
}


export default function bookingReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER_BOOKINGS: {
            const userBookingsState = { ...state };
            if (action.bookings.Bookings) {
                userBookingsState.user = normalize(action.bookings.Bookings);
            } else {
                return { ...state, user: null };
            }
            return userBookingsState;
        }
        case GET_SPOT_BOOKINGS: {
            const spotBookingsState = { ...state };
            if (action.bookings.Bookings) {
                spotBookingsState.spot = normalize(action.bookings.Bookings);
            } else {
                return { ...state, spot: null };
            }
            return spotBookingsState;
        }
        case ADD_BOOKING: {
            const addBookingState = { ...state };
            addBookingState.spot = { ...state.spot, [action.booking.id]: action.booking};
            return addBookingState;
        }
        case EDIT_BOOKING: {
            const editBookingState = { ...state };
            editBookingState.spot = { ...state.spot, [action.bookingId]: { ...state.user[action.bookingId], startDate: action.booking.startDate, endDate: action.booking.endDate } };
            editBookingState.spot = { ...state.user, [action.bookingId]: { ...state.user[action.bookingId], startDate: action.booking.startDate, endDate: action.booking.endDate } };
            return editBookingState;
        }
        case DELETE_BOOKING: {
            const deleteBookingState = { ...state };
            delete deleteBookingState.spot[action.bookingId];
            delete deleteBookingState.user[action.bookingId];
            return deleteBookingState;
        }
        default:
            return state;
    }
}
