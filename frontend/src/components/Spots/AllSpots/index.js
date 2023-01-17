import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { thunkGetAllSpots } from "../../../store/spots";
import "./AllSpots.css"

const preview = (image) => {
    if (image === "No preview image available") {
        image = "https://screenrant.com/wp-content/uploads/2018/01/Lord-of-the-Rings-Rivendell-The-Hobbit-Galadriel-Gandalf-Elrond.jpg";
        return image;
    } else {
        return image;
    }
}

export default function AllSpots() {
    const dispatch = useDispatch();
    const history = useHistory();
    const allSpots = useSelector(state => state.spots.spots);

    useEffect(() => {
        dispatch(thunkGetAllSpots())
    }, [dispatch])


    const spots = [];
    Object.values(allSpots).forEach(spot => spots.push(spot))
    if (!spots.length) return null

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
                        onClick={() => onClick(spot.id)} >
                        <div className="spot-img">
                            <img
                                className="spot-previewimg"
                                src={preview(spot.previewImage)}
                                onClick={() => onClick(spot.id)}
                            />
                        </div>
                        <div className="spot-card-bottom">
                            <div className="spot-card-header">
                                <p className="spot-location">{spot.city}, {spot.state}</p>
                                <p className="spot-rating"><i className="fa-solid fa-star" id="star"></i>   {rating(spot.avgRating)}</p>
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
