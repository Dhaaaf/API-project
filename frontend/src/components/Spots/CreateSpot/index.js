import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkAddSpot, thunkAddSpotImg } from "../../../store/spots";
import { useModal } from "../../../context/Modal";
import "./CreateSpot.css"

export default function CreateSpotForm() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imgUrl, setImgURL] = useState("")
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const errors = [];

        if (address && !address.length) {
            errors.push("Address is required.");
        }

        if (city && !city.length) {
            errors.push("City is required.");
        }

        if (state && !state.length) {
            errors.push("State is required.");
        }

        if (country && !country.length) {
            errors.push("Country is required.");
        }

        if (lat && !lat.length) {
            errors.push("Latitude is required.");
        }

        if (lng && !lng.length) {
            errors.push("Longitude is required.")
        }

        if (name && !name.length) {
            errors.push("Name is required.")
        }

        if (description && !description.length) {
            errors.push("Description is required.")
        }

        if (description.length > 50) {
            errors.push("Description length must be less than 50 characters.")
        }

        if (price && price < 1) {
            errors.push("Price per night must be greater than 0.")
        }

        setErrors(errors);
    }, [address, city, state, country, lat, lng, name, description, price]);


    const onSubmit = async (e) => {
        e.preventDefault();

        const newSpot = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        };

        setErrors([]);

        const url = imgUrl;

        const createdSpot = await dispatch(thunkAddSpot(newSpot))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })


        const previewImg = await dispatch(thunkAddSpotImg(createdSpot.id, url, true))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })


        closeModal();
        history.push(`/spots/${createdSpot.id}`);

    }

    return (
        <div className="form-div">
            <h1 className="title">Create a Spot!</h1>
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
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                    <label htmlFor="address">
                        Address
                    </label>
                </div>

                <div className="entries">
                    <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                    <label htmlFor="city">
                        City
                    </label>
                </div>

                <div className="entries">
                    <input
                        id="state"
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                    />
                    <label htmlFor="state">
                        State
                    </label>
                </div>

                <div className="entries">
                    <input
                        id="country"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                    <label htmlFor="country">
                        Country
                    </label>
                </div>

                <div className="entries">
                    <input
                        id="lat"
                        type="number"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        required
                    />
                    <label htmlFor="lat">
                        Latitude
                    </label>
                </div>

                <div className="entries">
                    <input
                        id="lng"
                        type="number"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        required
                    />
                    <label htmlFor="lng">
                        Longitude
                    </label>
                </div>

                <div className="entries">
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label htmlFor="name">
                        Name
                    </label>
                </div>

                <div className="entries">
                    <input
                        className="description"
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <label htmlFor="description">
                        Description
                    </label>
                </div>

                <div className="entries">
                    <input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    <label htmlFor="price">
                        Price
                    </label>
                </div>

                <div className="entries">
                    <input
                        id="imgUrl"
                        type="text"
                        value={imgUrl}
                        onChange={(e) => setImgURL(e.target.value)}
                        required
                    />
                    <label htmlFor="price">
                        Preview Image
                    </label>
                </div>

                <button type="submit" className="submit-button">Create New Spot</button>

            </form>
        </div>
    )
}
