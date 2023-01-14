// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);


    return (
        <div className='navigation-bar'>
            <div className='nav-innerdiv'>
                <div className='left-nav-div'>
                    <NavLink exact to="/" className="home-link"><i class="fa-brands fa-fort-awesome"></i></NavLink>
                </div>
                {isLoaded && (
                    <div className='right-nav-div'>
                        <ProfileButton user={sessionUser} />
                    </div>
                )}
            </div>
        </div>
    );

}




export default Navigation;
