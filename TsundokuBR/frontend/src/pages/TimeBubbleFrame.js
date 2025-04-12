import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../components/Body.css';
import '../components/NavButtons.css';
import '../components/Button.css';
import '../components/Titles.css';
import '../components/BubbleInfo.css';

function TimeBubbleFrame() {
    const [isOn, setIsOn] = useState(false);
    const [count, setCount] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch initial time bubble status and count from the backend
    useEffect(() => {
        const fetchTimeBubbleStatus = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError('User ID not found. Please log in again.');
                    return;
                }

                const response = await axios.get('http://localhost:5000/bubble', {
                    params: { userId },
                });
                if (response.data) {
                    setIsOn(response.data.status === 1);
                    setCount(response.data.count);
                }
            } catch (error) {
                console.error('Error fetching time bubble status:', error);
                setError('Failed to fetch bubble data. Please try again.');
            }
        };

        fetchTimeBubbleStatus();
    }, []);

    // Save time bubble state to the backend
    const saveBubbleState = async (status, count) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User ID not found. Please log in again.');
                return;
            }

            const bubbleData = { userId, status: status ? 1 : 0, count: count };
            const response = await axios.post('http://localhost:5000/bubble', bubbleData);
            if (response.status === 200 || response.status === 201) {
                console.log('Bubble state saved:', response.data);
            }
        } catch (error) {
            console.error('Failed to save bubble state:', error);
            setError('Failed to save bubble state. Please try again.');
        }
    };

    // Toggle time bubble status
    const toggleBubbleStatus = async () => {
        setLoading(true);
        const newStatus = !isOn;

        try {
            if (!newStatus) {
                await saveBubbleState(newStatus, 0);
                setIsOn(newStatus);
                setCount(0);
            } else {
                await saveBubbleState(newStatus, count);
                setIsOn(newStatus);
            }
        } catch (error) {
            console.error('Error toggling bubble status:', error);
            setError('Failed to toggle bubble status.');
        } finally {
            setLoading(false);
        }
    };

    // Increment time bubble count
    const handleIncrement = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User ID not found. Please log in again.');
                return;
            }

            await axios.post('http://localhost:5000/bubble/increment', { userId });
            setCount((prev) => prev + 1);
        } catch (error) {
            console.error('Error incrementing bubble count:', error);
            setError('Failed to increment bubble count. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Decrement time bubble count
    const handleDecrement = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId'); 
            if (!userId) {
                setError('User ID not found. Please log in again.');
                return;
            }

            if (count > 0) {
                await axios.post('http://localhost:5000/bubble/decrement', { userId });
                setCount((prev) => prev - 1);
            } else {
                setError('Cannot decrement. Count is already zero.');
            }
        } catch (error) {
            console.error('Error decrementing bubble count:', error);
            setError('Failed to decrement bubble count. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="titles">
                <div className="titleandimage">
                <h1>TsundokuBR</h1>
                <div className="logo"></div>
            </div>
           <h2>Time Bubble Frame Menu</h2>
            <h2>Switch your time bubble status!</h2>

            {/* Error Message */}
            {error && <p className="error-message">{error}</p>}

            {/* ON/OFF Buttons */}
            <div className="group-button">
                <button className="button" onClick={toggleBubbleStatus} disabled={loading}>
                    {isOn ? 'Turn Off' : 'Turn On'}
                </button>
            </div>

            {/* Time Bubble Info */}
            {isOn && (
                <div className="BubbleInfo">
                    <h2>Time Bubble Frame</h2>
                    <p>{count} Days</p>
                    <div className="button-grouph">
                        <button className="bubble-buttonh" onClick={handleIncrement} disabled={loading}>+</button>
                        <button className="bubble-buttonh" onClick={handleDecrement} disabled={loading}>-</button>
                    </div>
                </div>
            )}

            {/* Dashboard Navigation Button */}
            <Link to="/dashboard" className="button">Dashboard</Link>
        </div>
    );
}

export default TimeBubbleFrame;