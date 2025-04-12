import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../components/Body.css';
import '../components/NavButtons.css';
import '../components/Button.css';
import '../components/Titles.css';
import '../components/LevelInfo.css';

function ReadingLevel() {
    const [readingLevel, setReadingLevel] = useState('');
    const [showInfo, setShowInfo] = useState(false);

    // Fetch the reading level when the component mounts
    useEffect(() => {
        const fetchReadingLevel = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    console.error('User ID not found in localStorage');
                    return;
                }

                const response = await axios.get('http://localhost:5000/level', {
                    params: { userId },
                });
                setReadingLevel(response.data.readingLevel);
            } catch (error) {
                console.error('Error fetching reading level:', error);
            }
        };
        fetchReadingLevel();
    }, []);

    // Function to handle reading level update
    // This function sends the selected reading level to the server and updates the state
    const handleUpdateLevel = async (level) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('User ID not found in localStorage');
                alert('User ID is missing. Please log in again.');
                return;
            }

            console.log('Sending reading level:', { userId, readingLevel: level });
            const response = await axios.post('http://localhost:5000/level', {
                userId,
                readingLevel: level,
            });
            setReadingLevel(response.data.readingLevel);
            alert(`Reading level updated to: ${response.data.readingLevel}`);
        } catch (error) {
            console.error('Error updating reading level:', error.response?.data || error.message);
            alert('Failed to update reading level.');
        }
    };

    return (
        <div className="titles">
            <div className="titleandimage">
                <h1>TsundokuBR</h1>
                <div className="logo"></div>
            </div>
           <h2>Reading Level Menu</h2>
            <h2 className="level-header">
                <span>Select your preferred reading level!</span>
                {/* Info Button to Show/Hide Information */}
                <button
                    className="info-button"
                    onClick={() => setShowInfo(!showInfo)}
                    aria-label="More information"
                >
                    ?
                </button>
            </h2>
            {showInfo && (
                
                <div className="info-box">
                    <p>
                        The average reader typically... <br />
                        Reads 200-400 words per minute <br />
                        Reads for 20 minutes a day <br />
                        Reads 8-16 pages a day <br />
                        <br />
                        The reading levels are as follows: <br />
                        <strong>Light:</strong> 1-2 books per 28 days <br />
                        <strong>Moderate:</strong> 3-4 books per 28 days <br />
                        <strong>Heavy:</strong> 5+ books per 28 days <br />
                        </p>
                        </div>
                    )}
            {/* Current Reading Level Display */}
            <div className="info-box">
                <p>Current Reading Level: {readingLevel}</p>
            </div>
            {/* Buttons for Selecting Reading Level */}
            <div className="group-buttonv">
                <button className="buttonv" onClick={() => handleUpdateLevel('LIGHT')}>
                    Light
                </button>
                <button className="buttonv" onClick={() => handleUpdateLevel('MODERATE')}>
                    Moderate
                </button>
                <button className="buttonv" onClick={() => handleUpdateLevel('HEAVY')}>
                    Heavy
                </button>
            </div>
            {/* Dashboard Button */}
            <Link to="/dashboard" className="button">
                Dashboard
            </Link>
        </div>
    );
}

export default ReadingLevel;