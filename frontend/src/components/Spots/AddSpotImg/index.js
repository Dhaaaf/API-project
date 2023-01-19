import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkAddSpot, thunkAddSpotImg } from "../../../store/spots";
import { useModal } from "../../../context/Modal";
import "./AddSpotImg.css"

export default function AddSpotImageForm(spot) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();

    spot = spot.spot

    const [imgUrl, setImgURL] = useState("")
    const [errors, setErrors] = useState([]);


    const onSubmit = async (e) => {
        e.preventDefault();

        setErrors([]);

        const url = imgUrl;


        const newImg = await dispatch(thunkAddSpotImg(spot.id, url, false))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })


        closeModal();
        history.push(`/spots/${spot.id}`);

    }

    return (
        <div className="form-div">
            <h1 className="title">Add Spot Image!</h1>
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
                        id="imgUrl"
                        type="url"
                        value={imgUrl}
                        onChange={(e) => setImgURL(e.target.value)}
                        required
                    />
                    <label htmlFor="price">
                        Image
                    </label>
                </div>

                <button type="submit" className="submit-button">Add New Image</button>
            </form>
        </div>
    )
}
