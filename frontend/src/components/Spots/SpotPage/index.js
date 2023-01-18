import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetSingleSpot } from "../../../store/spots";
import EditSpotForm from "../EditSpot";
import DeleteSpotForm from "../DeleteSpot";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import SpotReviews from "../../Reviews/SpotReviews";
import CreateReview from "../../Reviews/CreateReview";


import "./SpotPage.css"

export default function SpotPage() {
    const { spotId } = useParams()
    const dispatch = useDispatch();

    const user = useSelector(state => state.session.user)
    const spot = useSelector(state => state.spots.singleSpot)
    const reviews = useSelector(state => state.reviews.spotReviews)

    useEffect(() => {
        dispatch(thunkGetSingleSpot(spotId))
    }, [dispatch, user, reviews])


    if (spot === {}) return null
    if (Object.values(spot).length === 0) return null


    let owner
    if (user && spot) {
        spot.ownerId === user.id ? owner = true : owner = false
    }

    const rating = (rating) => {
        if (typeof rating === "number") {
            return rating;
        } else {
            return "New";
        }
    }

    const images = [
        "https://i.pinimg.com/736x/e1/1d/4c/e11d4cdb0e95e4338908d8579784a906--el-dragon-dragon-art.jpg",
        "https://awoiaf.westeros.org/images/thumb/d/d4/Aegon_on_Balerion.jpg/1200px-Aegon_on_Balerion.jpg",
        "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2021/07/god-of-war-sigrun-boss.jpg",
        "https://i.pinimg.com/originals/fe/d2/67/fed267232be64e3b1d16d9703eb0e4fd.jpg",
        "https://media.npr.org/assets/img/2022/12/19/gettyimages-1450300260_custom-c5af9bcf4c0a466c8d8bf155c5917cc4ee5b1d62-s1100-c50.jpg",
    ];

    if (spot) {
        if (spot.SpotImages !== "No images listed") {
            for (let i = 0; i < spot.SpotImages.length; i++) {
                images[i] = spot.SpotImages[i].url;
            }
        }
    }

    function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }


    return spot && (
        <div className="spotPage-div">
            <h1 className="spot-name-title">{spot.name}</h1>
            <div className="header">
                <div className="header-left">
                    {typeof spot.avgStarRating === "number" ? (
                        <p className="header-left"><i className="fa-solid fa-star" id="star"></i>   {rating(spot.avgStarRating).toFixed(1)}</p>
                    ) : (
                        <p className="header-left"><i className="fa-solid fa-star" id="star"></i>   New</p>

                    )}
                    <p className="header-left">|</p>
                    {spot.numReviews === 1 ? (
                        <p className="header-left" id="num-reviews">{spot.numReviews} review</p>

                    ) : (
                        <p className="header-left" id="num-reviews">{spot.numReviews} reviews</p>
                    )}
                    <p className="header-left">|</p>
                    <p className="header-left" id="location">{spot.city}, {spot.state}, {spot.country}</p>
                </div>
                {owner && (
                    <div className="header-right">
                        <div className="edit-modal">
                            <i className="fa-solid fa-pen-to-square"></i>
                            <OpenModalMenuItem
                                itemText="Edit"
                                modalComponent={<EditSpotForm spot={spot} />}
                            />
                        </div>
                        <div className="delete-modal">
                            <i className="fa-solid fa-square-minus"></i>
                            <OpenModalMenuItem
                                itemText="Delete"
                                modalComponent={<DeleteSpotForm spot={spot} />}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className="img-div">
                <img className="big-picture" src={images[0]} />
                <div className="small-pictures-div">
                    <img className="small-picture" id="pic-1" src={images[1]} />
                    <img className="small-picture" id="pic-2" src={images[2]} />
                    <img className="small-picture" id="pic-3" src={images[3]} />
                    <img className="small-picture" id="pic-4" src={images[4]} />
                </div>
            </div>
            <div className="spot-info">
                <h2 className="owner-info">Hosted by {spot.Owner.firstName}</h2>
                <p className="rooms-etc">{randomNum(2, 9)} guests | {randomNum(2, 9)} bedrooms | {randomNum(2, 9)} beds | {randomNum(2, 9)} baths</p>
                <p className="spot-description">{spot.description}</p>
            </div>
            {
                (
                    <div className="spot-page-review-container">
                        <div className="spot-reviews-header">
                            <div className="spot-reviews-header-left">
                                {typeof spot.avgStarRating === "number" ? (
                                    <h2 className="header-left"><i className="fa-solid fa-star" id="star"></i>   {rating(spot.avgStarRating).toFixed(1)}</h2>
                                ) : (
                                    <h2 className="header-left"><i className="fa-solid fa-star" id="star"></i>   New</h2>

                                )}
                                {spot.numReviews === 1 ? (
                                    <h2 className="spot-reviews-number">{spot.numReviews} review</h2>

                                ) : (
                                    <h2 className="spot-reviews-number">{spot.numReviews} reviews</h2>
                                )}
                            </div>
                            {
                                user && user.id !== spot.ownerId && (
                                    <div className="spot-reviews-header-right">
                                        <i class="fa-solid fa-scroll"></i>
                                        <OpenModalMenuItem
                                            itemText="Leave a Review"
                                            modalComponent={<CreateReview spot={spot} />}
                                        />
                                    </div>
                                )
                            }
                        </div>

                        <div className="spot-reviews">
                            <SpotReviews user={user} />
                        </div>
                    </div>

                )
            }
        </div>
    )
}
