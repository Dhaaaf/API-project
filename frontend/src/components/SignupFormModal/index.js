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
            <div className="signup-form-div">
                <h3 className="signup-text">Sign Up</h3>
                <form onSubmit={handleSubmit} className='signup-form'>
                    <div className="signup-inputs">
                        <h3>Welcome to Fantasybnb</h3>
                        <label className="placeholder"
                            data-placeholder="Email">
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email"
                                id='email-input'
                            />
                        </label>
                        <label className="placeholder"
                            data-placeholder="Username">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Username"
                                id='user-input'
                            />
                        </label>
                        <label className="placeholder"
                            data-placeholder="First Name">
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                placeholder="First Name"
                                id='first-name-input'
                            />
                        </label>
                        <label className="placeholder"
                            data-placeholder="Last Name">
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                placeholder="Last Name"
                                id='last-name-input'
                            />
                        </label>
                        <label className="placeholder"
                            data-placeholder="Password">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                                id='pw-input'
                            />
                        </label>
                        <label className="placeholder"
                            data-placeholder="Confirm Password">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm Password"
                                id='confirm-password-input'
                            />
                        </label>
                        <ul>
                            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                        </ul>
                    </div>
                    <button type="submit" className="fantasybnb-button" id='sign-up-button'>Sign Up</button>
                </form>

            </div>
        </>
    );
}

export default SignupFormModal;
