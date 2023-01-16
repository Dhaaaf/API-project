// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
    };

    return (
        <>
            <div className="form-div">
                <h1 className="title">Log In</h1>
                <h3 className="mini-title">Welcome to Fantasybnb</h3>
                <ul className="errors">
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <form onSubmit={handleSubmit} className='form'>
                    <div className="entries">
                        <input
                            type="text"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            required
                            id='username-input'
                        />
                        <label htmlFor="credentials">
                            Username or Email
                        </label>
                    </div>
                    <div className="entries">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            id="password-input"
                        />
                        <label htmlFor="password">
                            Password
                        </label>
                    </div>
                    <button type="submit" className='submit-button' id='log-in-button'>Log In</button>
                </form>
            </div>
        </>
    );

}

export default LoginFormModal;
