import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './ProfileButton.css'
import { useHistory } from "react-router-dom";

function ProfileButton({ user }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        history.push('/')
        dispatch(sessionActions.logout());
        closeMenu();
    };

    const mySpots = (e) => {
        e.preventDefault();
        history.push('/my-spots')
        closeMenu();
    }

    const myBookings = (e) => {
        e.preventDefault();
        history.push('/my-bookings')
        closeMenu();
    }

    const demoSignIn = (e) => {
        e.preventDefault();
        const password = "password"
        const credential = "demo@user.io"
        dispatch(sessionActions.login({ credential, password }));
        closeMenu();
    }

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <div className='profile-button-container'>
            <button onClick={openMenu} className='profile-button'>
                <div className="profile-button-bars-div">
                    <i className="fa-solid fa-bars" id='solid-bars' />
                    <i className="fas fa-user-circle" />
                </div>
            </button>
            <div className={ulClassName} ref={ulRef}>
                {user ? (

                    <div className="profile-info-actions">
                        <p>{user.username}</p>
                        <p>{user.firstName} {user.lastName}</p>
                        <p id="profile-email">{user.email}</p>
                        <button onClick={mySpots} className='fantasybnb-button' id="my-spots-button">My Spots</button>
                        <button onClick={myBookings} className='fantasybnb-button' id="my-spots-button">My Bookings</button>
                        <button onClick={logout} className='fantasybnb-button' id='logout-button'>Log Out</button>
                    </div>

                ) : (
                    <div className="dropdown-menu">
                        <div className="log-in-sign-up">
                            <div id="sign-up-modal">
                                <OpenModalMenuItem
                                    itemText="Sign Up"
                                    onItemClick={closeMenu}
                                    modalComponent={<SignupFormModal />}
                                />
                            </div>
                            <div id="log-in-modal">
                                <OpenModalMenuItem
                                    itemText="Log In"
                                    onItemClick={closeMenu}
                                    modalComponent={<LoginFormModal />}
                                />
                            </div>
                            <button onClick={demoSignIn} type="submit" className='fantasybnb-button' id='demo-user-button'>Demo User</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileButton;
