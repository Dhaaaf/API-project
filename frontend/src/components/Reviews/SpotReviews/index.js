// import { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { thunkGetSpotReviews } from "../../../store/reviews";
// import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
// import DeleteReviewForm from "../DeleteReview";

// export default function SpotReviews({ user }) {
//     const dispatch = useDispatch();
//     const reviews = useSelector(state => state.reviews.spotReviews)
//     const spot = useSelector(state => state.spots.singleSpot)

//     useEffect(() => {
//         dispatch(thunkGetSpotReviews(+spot.id))
//     }, [dispatch, spot.numReviews])

//     if (spot === undefined) return null;
//     if (user === undefined) return null;
//     if (reviews === undefined) return null;


//     const monthNames = ["January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//     ];

//     const convertDate = (date) => {
//         const month = monthNames[new Date(date).getMonth()];
//         const year = new Date(date).getFullYear();

//         return (
//             <p className="reviews-date">{month} {year}</p>
//         )
//     }


//     return reviews && (
//         <div>
//             {spot.numReviews === 0 ? (
//                 <div className="spots-review-div">No reviews for this spot yet!</div>
//             ) : (
//                 <div className="spots-review-div">
//                     {Object.values(reviews).map((review) => (
//                         review.User && (
//                             <div key={review.id} className="review-spots-card">
//                                 <div className="spots-review-card-top-div">
//                                     <div className="spots-review-top-left">
//                                         <p className="review-user-name">{review.User.firstName}</p>
//                                         {convertDate(review.createdAt)}
//                                     </div>
//                                     {user && user.id === review.userId && (
//                                         <div className="spots-review-top-right">
//                                             <OpenModalMenuItem
//                                                 itemText="Delete"
//                                                 modalComponent={<DeleteReviewForm review={review} />}
//                                             />
//                                         </div>
//                                     )}
//                                 </div>
//                                 <p className="review-spots-text">{review.review}</p>
//                             </div>
//                         )
//                     ))}
//                 </div>
//             )}
//         </div>
//     )


// }
