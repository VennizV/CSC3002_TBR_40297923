import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../components/BookCoverGrid.css';
import '../components/Button.css';

function ReadShelf() {
    const [covers, setCovers] = useState([]);

    // Fetch book covers from the server when the component mounts
    useEffect(() => {
        const fetchReadBooks = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get('http://localhost:5000/read/books', {
                    params: { userId },
                });
                setCovers(response.data);
            } catch (error) {
                console.error('Error fetching Read books:', error);
            }
        };        

        fetchReadBooks();
    }, []);

    return (
        <div className="titles">
            <div className="titleandimage">
                <h1>TsundokuBR</h1>
                <div className="logo"></div>
            </div>
           <h2>Read Shelf</h2>

            {/* Grid of Book Covers */}
            <div className="book-cover-grid">
                {covers.map((cover, index) => (
                    <div key={index} className="book-container">
                        <img
                            src={cover.cover}
                            alt={cover.title || `Book Cover ${index + 1}`}
                            className="book-cover"
                        />
                        <p><strong>{cover.title}</strong></p>
                        <p>{cover.author}</p>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="navbar">
                <Link to="/searchcomponent" className="nav-button">Search for a Book</Link>
                <Link to="/tbrshelf" className="nav-button">TBR Shelf</Link>
            </div>

            {/* Dashboard Button */}
            <Link to="/dashboard" className="button-main-control">Dashboard</Link>
        </div>
    );
}

export default ReadShelf;
