import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkDeleteSpot } from "../../../store/spots";
import { useModal } from "../../../context/Modal";

import "./DeleteSpot.css"

export default function DeleteSpotForm(spot) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();

    spot = spot.spot

    const [errors, setErrors] = useState([]);


    const goBack = (e) => {
        e.preventDefault();

        closeModal();
    }

    const submitDelete = async (e) => {
        e.preventDefault()

        const deleteSpot = await dispatch(thunkDeleteSpot(spot.id))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
        closeModal();
        history.push("/")
    }

    return (
        <div className="form-div">
            <h1 className="title">Are you sure you want to delete this spot?</h1>
            <ul className="errors">
                {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>
            <form
                className="form"
            >
                <button type="submit" className="submit-button" id="deleteSpot-button" onClick={submitDelete}>Yes Delete This Spot</button>
            </form>
        </div>
    )

}
