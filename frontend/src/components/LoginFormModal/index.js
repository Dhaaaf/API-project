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
            <div className="log-in-form-div">
                <h3 className="login-text">Log In</h3>
                <form onSubmit={handleSubmit} className='login-form'>
                    <div className="login-inputs">
                        <h3>Welcome to Fantasybnb</h3>
                        <label className="placeholder"
                            data-placeholder="Username or Email">
                            {/* Username or Email */}
                            <input
                                type="text"
                                value={credential}
                                onChange={(e) => setCredential(e.target.value)}
                                required
                                placeholder="Username or Email"
                                id='username-input'
                            />
                        </label>
                        <label
                            className="placeholder"
                            data-placeholder="Password">
                            {/* Password */}
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                                id="password-input"
                            />
                        </label>
                    </div>
                    <ul>
                        {errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                    <button type="submit" className='fantasybnb-button' id='log-in-button'>Log In</button>
                </form>
            </div>
        </>
    );
}

export default LoginFormModal;
