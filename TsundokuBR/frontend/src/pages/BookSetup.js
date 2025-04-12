import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../components/Body.css';
import '../components/NavButtons.css';
import '../components/Button.css';
import '../components/Titles.css';

function BookSetup() {

    return (
        <div className="titles">
            <div className="titleandimage">
                <h1>TsundokuBR</h1>
                <div className="logo"></div>
            </div>
           <h2>Book Menu</h2>

            <div className="navbar">
                {/* Navigation Buttons */}
                <Link to="/searchcomponent" className="nav-button">Search for a Book </Link>
                <Link to="/bookselectionwheel" className="nav-button">Wheel of Choice </Link>               
            </div>

            {/* Dashboard Button */}
            <Link to="/dashboard" className="button-main-control">Dashboard</Link>
        </div>
    );

    
}

export default BookSetup;
