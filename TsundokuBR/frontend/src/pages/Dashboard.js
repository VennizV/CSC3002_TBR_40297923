import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/Body.css';
import '../components/NavButtons.css';
import '../components/Button.css';
import '../components/Titles.css';
import '../components/BookCoverInfo.css';

function Dashboard({ onLogout }) {
    const [currentRead, setCurrentRead] = useState(null);
    const [readingLevel, setReadingLevel] = useState('');
    const [timeBubbleStatus, setTimeBubbleStatus] = useState(0);
    const [timeBubbleCount, setTimeBubbleCount] = useState(0);
    const [totalBooksRead, setTotalBooksRead] = useState(0);
    const [totalBooksInTBR, setTotalBooksInTBR] = useState(0);
    const navigate = useNavigate();

    // Fetch initial dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    console.error('User ID not found in localStorage');
                    return;
                }

                // Fetch Reading Level
                const readingLevelResponse = await axios.get('http://localhost:5000/level', {
                    params: { userId }
                });
                setReadingLevel(readingLevelResponse.data?.readingLevel || '');

                // Fetch Time Bubble Status
                const bubbleResponse = await axios.get('http://localhost:5000/bubble', {
                    params: { userId }
                });
                setTimeBubbleStatus(bubbleResponse.data?.status || 0);
                setTimeBubbleCount(bubbleResponse.data?.count || 0);

                // Fetch Total Books in TBR
                const tbrResponse = await axios.get('http://localhost:5000/tbr', {
                    params: { userId }
                });
                setTotalBooksInTBR(tbrResponse.data?.totalBooksInTBR || 0);

                // Fetch Total Books Read
                const readCountResponse = await axios.get('http://localhost:5000/read/count', {
                    params: { userId }
                });
                setTotalBooksRead(readCountResponse.data?.totalBooksRead || 0);

                // Fetch Current Read
                const currentReadResponse = await axios.get('http://localhost:5000/api/getCurrentRead', {
                    params: { userId }
                });

                if (currentReadResponse.data) {
                    setCurrentRead(currentReadResponse.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    // Decrement Time Bubble Count daily
    useEffect(() => {
        const decrementBubbleDaily = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('User ID not found in localStorage');
                return;
            }

            if (timeBubbleStatus === 1 && timeBubbleCount > 0) {
                try {
                    // Decrement count on the backend
                    await axios.post('http://localhost:5000/bubble/decrement', { userId });
                    
                    // Fetch updated count from the backend
                    const bubbleResponse = await axios.get('http://localhost:5000/bubble', {
                        params: { userId }
                    });
                    setTimeBubbleCount(bubbleResponse.data?.count || 0);
                } catch (error) {
                    console.error('Error decrementing time bubble count:', error);
                }
            }
        };

        const intervalId = setInterval(() => {
            decrementBubbleDaily();
        }, 24 * 60 * 60 * 1000); // Decrement every 24 hours

        return () => clearInterval(intervalId);
    }, [timeBubbleStatus, timeBubbleCount]);

    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };

    return (
        <div className="titles">
            <div className="titleandimage">
                <h1>TsundokuBR</h1>
                <div className="logo"></div>
            </div>
           <h2>Dashboard</h2>
            {/* Display Current Read Book Cover */}
            <div className="current-read-container">
                {currentRead && currentRead.cover ? (
                    <img
                        src={currentRead.cover}
                        alt={`Current Read: ${currentRead.title}`}
                        className="current-read-cover"
                    />
                ) : (
                    <p>No current read set.</p>
                )}
            </div>

            {/* User Stats Info Box */}
            <div className="book-info">
                <h2>Reading Status</h2>
                <p>
                    <strong>Time Bubble:</strong> {timeBubbleStatus === 1 ? 'On ' : 'Off '} 
                    ({timeBubbleCount} {timeBubbleCount === 1 ? 'Day' : 'Days'})
                </p>
                <p><strong>Current Reading Level:</strong> {readingLevel}</p>
                <p><strong>Total Books Read:</strong> {totalBooksRead}</p>
                <p><strong>Total Books in TBR Shelf:</strong> {totalBooksInTBR}</p>
            </div>

            {/* Navigation Buttons */}
            <div className="navbar">
                <Link to="/timebubbleframe" className="nav-button">Time Bubble</Link>
                <Link to="/readinglevel" className="nav-button">Reading Level</Link>
                <Link to="/booksetup" className="nav-button">My Book Setup</Link>
                <Link to="/tbrshelf" className="nav-button">TBR Shelf</Link>
                <Link to="/readshelf" className="nav-button">Read Shelf</Link>
            </div>

            {/* Logout Button */}
            <button onClick={handleLogoutClick} className="button-main-control">Logout</button>
        </div>
    );
}

export default Dashboard;