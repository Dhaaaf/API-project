import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { thunkGetSpotReviews } from "../../../store/reviews";

export default function SpotReviews({ spot, user }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const reviews = useSelector(state => state.reviews.spotReviews)
    console.log("reviews.......", reviews)

    useEffect(() => {
        dispatch(thunkGetSpotReviews(+spot.id))
    }, [dispatch, spot.id])

    if (spot === undefined) return null;
    if (user === undefined) return null;
    if (reviews === undefined) return null;


    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const convertDate = (date) => {
        const month = monthNames[new Date(date).getMonth()];
        const year = new Date(date).getFullYear();

        return (
            <p className="reviews-date">{month} {year}</p>
        )
    }



    return (
        <div>
            {spot.numReviews === 0 ? (
                <div className="spots-review-div">No reviews for this spot yet!</div>
            ) : (
                <div className="spots-review-div">
                    {Object.values(reviews).map((review) => (
                        <div key={review.id} className="review-spots-card">
                            <p className="review-user-name">{review.User.firstName}</p>
                            {convertDate(review.createdAt)}
                            <p className="review-spots-text">{review.review}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )


}
