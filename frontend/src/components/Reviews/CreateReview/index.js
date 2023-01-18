import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import { useHistory, useParams } from "react-router";
import { thunkAddReview } from "../../../store/reviews";
import { thunkGetSingleSpot } from "../../../store/spots";
import { useModal } from "../../../context/Modal";


import "./CreateReview.css"

export default function CreateReview(spot) {
    spot = spot.spot
    const dispatch = useDispatch();
    // const history = useHistory();
    const { closeModal } = useModal();

    const [review, setReview] = useState("");
    const [stars, setStars] = useState("");
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const errors = [];

        if (review && !review.length) {
            errors.push("Please enter a review.");
        }

        if (stars && (stars < 1 || stars > 5)) {
            errors.push("Star rating should be between 1 and 5.")
        }

        setErrors(errors);
    }, [review, stars])

    const onSubmit = async (e) => {
        e.preventDefault();

        const newReview = {
            review,
            stars
        };

        const createdReview = await dispatch(thunkAddReview(spot.id, newReview))


        const backToSpot = await dispatch(thunkGetSingleSpot(spot.id))
        closeModal();
        // history.push(`/spots/${spot.id}`);
    }

    return (
        <div className="form-div">
            <h1 className="title">Leave a Review!</h1>
            <ul className="errors">
                {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>
            <form
                onSubmit={onSubmit}
                className="form"
            >
                <div className="entries">
                    <input
                        id="review"
                        type="text"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                    <label htmlFor="address">
                        Leave your review
                    </label>
                </div>

                <div className="entries">
                    <input
                        id="star-rating"
                        type="number"
                        value={stars}
                        onChange={(e) => setStars(e.target.value)}
                        required
                    />
                    <label htmlFor="city">
                        Stars
                    </label>
                </div>

                <button type="submit" className="submit-button" id="leave-review-button">Leave Review</button>

            </form>
        </div>
    )

}
