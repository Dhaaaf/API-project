import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkDeleteReview } from "../../../store/reviews";
import { useModal } from "../../../context/Modal";
import { thunkDeleteBooking } from "../../../store/bookings";
import "./DeleteBooking.css"

export default function DeleteReviewForm(booking) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    review = review.review

    const [errors, setErrors] = useState([]);


    const goBack = (e) => {
        e.preventDefault();

        closeModal();
    }

    const submitDelete = async (e) => {
        e.preventDefault()

        
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
                <button type="submit" className="submit-button" id="deleteSpot-button" onClick={submitDelete}>Yes Delete This Review</button>
            </form>
        </div>
    )


}
