import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors([]);
            return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                });
        }
        return setErrors(['Confirm Password field must be the same as the Password field']);
    };

    return (
        <>
            <div className="form-div">
                <h1 className="title">Sign Up</h1>
                <h3 className="mini-title">Welcome to AirDnD</h3>
                <ul className="errors">
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <form onSubmit={handleSubmit} className='form'>
                    <div className="entries">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            id='email-input'
                        />
                        <label htmlFor="email">
                            Email
                        </label>
                    </div>

                    <div className="entries">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            id='user-input'
                        />
                        <label htmlFor="username">
                            Username
                        </label>
                    </div>
                    <div className="entries">
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            id='first-name-input'
                        />
                        <label htmlFor="firstName">
                            First Name
                        </label>
                    </div>
                    <div className="entries">
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            id='last-name-input'
                        />
                        <label htmlFor="lastName">
                            Last Name
                        </label>
                    </div>
                    <div className="entries">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            id='pw-input'
                        />
                        <label htmlFor="password">
                            Password
                        </label>
                    </div>
                    <div className="entries">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            id='confirm-password-input'
                        />
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                    </div>
                    <button type="submit" className='submit-button' id='sign-up-button'>Sign Up</button>
                </form>
            </div>
        </>
    );
}

export default SignupFormModal;
