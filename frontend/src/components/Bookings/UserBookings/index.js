import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { thunkGetUserBookings } from "../../../store/bookings";
import "./UserBookings.css";
import { thunkGetAllSpots } from "../../../store/spots";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import DeleteBookingForm from "../DeleteBooking";

export default function UserBookings() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const bookings = useSelector(state => state.bookings.user);
    const allSpots = useSelector(state => state.spots.spots);
    const [showMenu, setShowMenu] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false)
    


    useEffect(() => {
        dispatch(thunkGetUserBookings(user.id));
        dispatch(thunkGetAllSpots());
        setIsLoaded(true)
    }, [dispatch, isLoaded])

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




    /// Format date string

    function reformatDateString(dateString) {
        // Split the date string into an array of [year, month, day]
        const dateComponents = dateString.split('-');
      
        // Reassemble the components in the desired format: [day, month, year]
        const reformattedDate = dateComponents[2] + '-' + dateComponents[1] + '-' + dateComponents[0];
      
        return reformattedDate;
    }


    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    const closeMenu = () => setShowMenu(false);

    let spots = Object.values(allSpots)

    if (spots.length === 0) return null

    return bookings && allSpots && (
        <div className="userBookings-container">
            <h1 className="userBookings-trips">Your Trips</h1>
            {bookings && bookingsArray.map(booking => (
                <div className="booking-card" key={booking.id}>
                    <div className="booking-card-left">
                        <div className="booking-spot-name">{booking.Spot.name}</div>
                        <div className="booking-spot-address">{booking.Spot.address}</div>
                        <div className="booking-spot-city-country">{booking.Spot.city}, {booking.Spot.country}</div>
                        <div className="booking-start">From: {reformatDateString(booking.startDate.slice(0, 10))}</div>
                        <div className="booking-end">To: {reformatDateString(booking.endDate.slice(0,10))}</div>    
                        <div className="booking-buttons">
                            {/* <div className="edit-booking">Edit</div> */}

                            <div className="delete-booking">
                            <OpenModalMenuItem
                            itemText="Delete"
                            onItemClick={closeMenu}
                            modalComponent={< DeleteBookingForm bookingId={booking.id} isLoaded={isLoaded} setIsLoaded={setIsLoaded}/>}
                            />
                            </div>
                        </div>                    
                    </div>
                    <div className="booking-card-right">
                        {allSpots[booking.Spot.id].previewImage === "No preview image available" ? (
                            <img className="booking-card-img" src="https://i.pinimg.com/736x/e1/1d/4c/e11d4cdb0e95e4338908d8579784a906--el-dragon-dragon-art.jpg" />
                        ) : (
                            <img className="booking-card-img" src={allSpots[booking.Spot.id].previewImage} />
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
