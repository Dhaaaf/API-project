import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useParams } from "react-router";
import { thunkAddBooking, thunkGetUserBookings } from "../../../store/bookings";
import "./CreateBookings.css"

export default function CreateBookings() {
    const { spotId } = useParams();
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const history = useHistory();
    const spot = useSelector(state => state.spots.singleSpot)

    // format Date helper func
    const formatDate = (day) => {
        const date = `0${day.getDate()}`.slice(-2);
        const month = `0${day.getMonth() + 1}`.slice(-2);
        const year = day.getFullYear();
    
        // console.log("YYYY-MM-DD",`${year}-${month}-${date}`);
        return `${year}-${month}-${date}`;
    }



    // set dates helper
    const setDates = (val) => {
        const now = new Date();
        now.setDate(now.getDate() + 10);
        const start = now;
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
    
        if (val === "start") {
            return formatDate(start);
        } else {
            return formatDate(end);
        }
    }




    const [ startDate, setStartDate ] = useState(setDates("start"));
    const [ endDate, setEndDate ] = useState(setDates("end"));
    const [ errors, setErrors ] = useState([]);




    // Change end Date helper

    const getEndDate = (start) => {
        const startDate = new Date(start);
        startDate.setDate(startDate.getDate() + 7);
        const endDate = startDate;
    
        return formatDate(endDate);
    }

    // useEffect

    useEffect(() => {
        setEndDate(getEndDate(startDate));
    }, [startDate])


    // handleSubmit

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const newBooking = {
            startDate,
            endDate
        }


        const makeNewBooking = await dispatch(thunkAddBooking(+spotId, newBooking))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })

        if (makeNewBooking) {
            dispatch(thunkGetUserBookings(user.id))
            // history.push(`/my-trips`)
        }
    }

    if (!user) return null


    // total days helper

    const totalReservationDays = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
    
        if (endDate) {
            const end = new Date(endDate);
            const difference = end.getTime() - start.getTime();
            const convertToDays = difference / ( 1000 * 60 * 60 * 24 ) + 1;
            return Math.round(convertToDays);
        }
    
        const difference = start.getTime() - now.getTime();
        const convertToDays = difference / ( 1000 * 60 * 60 * 24 );
    
        return Math.round(convertToDays);
    }

    const totalPrice = (startDate, endDate, price) => {
        const totalDays = totalReservationDays(startDate, endDate);

        let cost = Number(price * totalDays).toFixed(2);

        return cost
    }

    let cost = totalPrice(startDate, endDate, spot.price)



    return (
        <div className="createBooking-container">
            <div className="createBooking-header-container">
                <div className="createBooking-header-container-left">
                    <h1 className="createBooking-header">${Number(spot.price).toFixed(2)}</h1>
                    <span className="createBooking-header-night">night</span>
                </div>
            </div>
            <div className="createBooking-error-container">
                <ul className="createBooking-errors">
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
            </div>
            <form
                onSubmit={onSubmit}
                className="createBooking-form"
            >
            <div className="createBooking-main-container">
                <div className="createBooking-group">
                    <div className="startDate">
                        <input
                        className="createBooking-lat"
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <label htmlFor="lat">
                            Check-In
                        </label>
                    </div>
                    <div className="endDate">
                        <input
                        className="createBooking-lat"
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <label htmlFor="lat">
                            Check-Out
                        </label>
                    </div>
                </div>
            </div>

            <div className="createBooking-button-container">
                <button type="submit" className="createBooking-submit">Reserve</button>
            </div>

            </form>

            <div className="createBooking-bottom-container">
                <p className="createBooking-small-text-no-charge">
                    You won't be charged yet.
                </p>
                <div className="createBooking-charges-container">
                    <div className="createBooking-charges-groups">
                        <div className="createBooking-charge-group">
                            <p className="createBooking-charge-header">${Number(spot.price).toFixed(2)} x {totalReservationDays(startDate, endDate)} nights</p>
                            <p className="createBooking-charge-calc">${cost}</p>
                        </div>
                    </div>
                    <div className="createBooking-divider"></div>
                    <div className="createBooking-charge-total">
                        <p className="createBooking-total-header">Total before taxes</p>
                        <p className="createBooking-total-calc">${cost}</p>
                    </div>
                </div>
            </div>
        </div>
    )



}
