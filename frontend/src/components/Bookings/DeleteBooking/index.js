import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { thunkDeleteBooking } from "../../../store/bookings";
import { useHistory } from "react-router-dom";
import "./DeleteBooking.css"

export default function DeleteBookingForm({bookingId, isLoaded, setIsLoaded}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const history = useHistory()


    const [errors, setErrors] = useState([]);


    const goBack = (e) => {
        e.preventDefault();
        closeModal();
    }

    const submitDelete = async (e) => {
        e.preventDefault()
        const deleteBooking = await dispatch(thunkDeleteBooking(bookingId))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
        setIsLoaded(false)
        closeModal();
    }

    

    return (
        <div className="form-div">
            <h1 className="title">Are you sure you want to delete this booking?</h1>
            <ul className="errors">
                {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>
            <form
                className="form"
            >
                <button type="submit" className="submit-button" id="deleteBooking-button" onClick={submitDelete}>Yes Delete This Booking</button>
            </form>
        </div>
    )


}
