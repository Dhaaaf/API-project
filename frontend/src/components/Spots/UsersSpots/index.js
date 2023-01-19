import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkGetUsersSpots } from "../../../store/spots";
import "./UsersSpots.css"



const preview = (image) => {
    if (image === "No preview image available") {
        image = "https://assets.vogue.com/photos/598dacb5f0b0e21484d342ba/master/w_2560%2Cc_limit/00-lede-a-game-of-thrones-guide-to-dubrovnik-croatia.jpg";
        return image;
    } else {
        return image;
    }
}

export default function UsersSpots() {
    const dispatch = useDispatch();
    const history = useHistory();
    const allSpots = useSelector(state => state.spots.spots);

    const user = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(thunkGetUsersSpots())
    }, [dispatch])


    const spots = [];
    console.log(allSpots)
    if (!allSpots) {
        return (
            <div className="title">
                You currently have no listed spots
            </div>
        )
    }
    Object.values(allSpots).forEach(spot => spots.push(spot))
    if (!spots.length) return null
    console.log(spots)

    const onClick = (spotId) => {
        history.push(`/spots/${spotId}`)
    }

    const rating = (rating) => {
        if (typeof rating === "number") {
            return rating;
        } else {
            return "New";
        }
    }


    return (
        <div className="allSpots-div">
            {spots && (
                spots.map((spot) => (
                    < div key={spot.id} className="spot-card"
                        onClick={() => onClick(spot.id)}>
                        <div className="spot-img">
                            <img
                                className="spot-previewimg"
                                src={preview(spot.previewImage)}
                            />
                        </div>
                        <div className="spot-card-bottom">
                            <div className="spot-card-header">
                                <p className="spot-location">{spot.city}, {spot.state}</p>
                                {typeof spot.avgRating === "number" ? (
                                    <p className="spot-rating"><i className="fa-solid fa-star" id="star"></i>   {rating(spot.avgRating).toFixed(1)}</p>
                                ) : (
                                    <p className="spot-rating"><i className="fa-solid fa-star" id="star"></i>   New</p>

                                )}
                            </div>
                            <div className="spot-card-middle">
                                <p className="spot-name">{spot.name}</p>
                            </div>
                            <div className="spot-card-footer">
                                <p className="spot-price">${spot.price}</p>
                                <p className="per-night">night</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div >

    )
}
