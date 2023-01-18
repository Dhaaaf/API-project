import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkDeleteReview } from "../../../store/reviews";
import { useModal } from "../../../context/Modal";
import { thunkGetSingleSpot } from "../../../store/spots";

import "./DeleteReview.css"

export default function DeleteReviewForm(review) {
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

        const deleteReview = await dispatch(thunkDeleteReview(review.id))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
        dispatch(thunkGetSingleSpot(review.spotId))
        closeModal();
    }

    return (
        <div className="form-div">
            <h1 className="title">Are you sure you want to delete this review?</h1>
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
