// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import OpenModalMenuItem from './OpenModalMenuItem';
import SignupFormModal from '../SignupFormModal';
import CreateSpotForm from '../Spots/CreateSpot';


function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);


    return (
        <div className='navigation-bar'>
            <div className='nav-innerdiv'>
                <div className='left-nav-div'>
                    <NavLink exact to="/" className="home-link"><i class="fa-solid fa-dragon"></i></NavLink>
                </div>
                {isLoaded && (
                    <div className='right-nav-div'>
                        {sessionUser ? (
                            <span className='create-spot'>
                                <div>
                                    <OpenModalMenuItem
                                        itemText="Airdnd your home"
                                        modalComponent={<CreateSpotForm />}
                                    />
                                </div>
                            </span>
                        ) : (
                            <span className='create-spot'>
                                <div>
                                    <OpenModalMenuItem
                                        itemText="Airdnd your home"
                                        modalComponent={<SignupFormModal />}
                                    />
                                </div>
                            </span>
                        )}
                        <div className='profile-button'>
                            <ProfileButton user={sessionUser} />
                        </div>
                    </div>
                )}
            </div>
        </div >
    );

}




export default Navigation;
