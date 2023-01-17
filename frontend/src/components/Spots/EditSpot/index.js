import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunkEditSpot, thunkGetSingleSpot } from "../../../store/spots";
import { useModal } from "../../../context/Modal";
import "./EditSpot.css"

export default function EditSpotForm(spot) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();

    spot = spot.spot;

    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [country, setCountry] = useState(spot.country);
    const [lat, setLat] = useState(spot.lat);
    const [lng, setLng] = useState(spot.lng);
    const [name, setName] = useState(spot.name);
    const [description, setDescription] = useState(spot.description);
    const [price, setPrice] = useState(spot.price);
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
    }, [address, city, state, country, name, description, price]);


    const onSubmit = async (e) => {
        e.preventDefault();

        const editedSpot = {
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

        const editSpot = await dispatch(thunkEditSpot(spot.id, editedSpot))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            })
        closeModal();
    }


    return (
        <div className="form-div">
            <h1 className="title">Edit Spot!</h1>
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
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label htmlFor="name">
                        Spot Name
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

                <button type="submit" className="submit-button">Edit Spot</button>

            </form>
        </div>
    )
}
