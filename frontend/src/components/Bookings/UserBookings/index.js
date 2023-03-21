import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { thunkGetUserBookings } from "../../../store/bookings";
import "./UserBookings.css";

export default function UserBookings() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const bookings = useSelector(state => state.bookings.user);


    useEffect(() => {
        dispatch(thunkGetUserBookings(user.id));
    }, [dispatch])

    if (!user) return null;

    if (!bookings) {
        return (
        <div className="UserBookings-container">
            <h1 className="UserBookings-header">Trips</h1>
            <div className="UserBookings-no-trips-container">
                <h2 className="UserBookings-secondary-header">
                    No trips
                </h2>
            </div>
        </div>
        )
    }

    let bookingsArray
    if (bookings) {
        bookingsArray = Object.values(bookings);
    }

    if (!bookingsArray) return null;

    console.log(bookingsArray)

    return bookings && (
        <div className="UserBookings-container">
            <h1 className="UserBookings-header">Trips</h1>
            {bookings && bookingsArray.map(booking => (
                <div className="booking-card" id={booking.id}>
                    <div className="booking-card-left">
                        <div className="booking-spot-name">{booking.Spot.name}</div>
                        <div className="booking-spot-address">{booking.Spot.address}</div>
                        <div className="booking-spot-city-country">{booking.Spot.city}, {booking.Spot.country}</div>
                        <div className="booking-start">From: {booking.startDate.slice(0, 10).split('').reverse().join('')}</div>
                        <div className="booking-end">To: {booking.endDate.slice(0,10).split('').reverse().join('')}</div>

                        
                    </div>
                </div>
            ))}
        </div>
    )
}
