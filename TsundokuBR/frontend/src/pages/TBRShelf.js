import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../components/BookCoverGrid.css';
import '../components/Button.css';

function TBRShelf() {
    const [covers, setCovers] = useState([]);
    const [selectedCover, setSelectedCover] = useState(null);

    // Fetch TBR books from the server
    useEffect(() => {
        const fetchTBRBooks = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    throw new Error('User ID is not available.');
                }
    
                const response = await axios.get('http://localhost:5000/tbr/books', {
                    params: { userId }
                });
    
                console.log(response.data);
                setCovers(response.data);
            } catch (error) {
                console.error('Error fetching TBR books:', error);
            }
        };
    
        fetchTBRBooks();
    }, []);
    

    // Handle book cover click
    // This function toggles the selected cover and shows the buttons for that cover
    const handleCoverClick = (cover) => {
        setSelectedCover(selectedCover === cover ? null : cover);
    };

    // Handle adding book to Read Shelf
    // This function sends a request to the server to move the book to the Read Shelf
    const handleAddToReadShelf = async (cover) => {
        const userId = localStorage.getItem('userId');
    
        if (!userId) {
            alert('You must log in to add books to your Read Shelf.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5000/api/moveToReadShelf', {
                userId,
                bookCover: cover.cover,
            });
    
            if (response.data.success) {
                setCovers(prevCovers => prevCovers.filter(item => item.cover !== cover.cover));
                alert('Book moved to Read Shelf successfully!');
            } else {
                alert('Failed to move the book. Please try again.');
            }
        } catch (error) {
            console.error('Error moving book to Read Shelf:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    // Handle setting book as Current Read
    // This function sends a request to the server to set the book as the current reading book
    // It also checks if the user is logged in and if the book has a valid ID
    const handleSetAsCurrentRead = async (cover) => {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            alert('You must log in to set a book as your Current Read.');
            return;
        }
        
        if (!cover.book_id) {
            alert('This book does not have a valid ID.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5000/api/setCurrentRead', {
                userId,
                bookId: cover.book_id,
            });
    
            if (response.status === 200) {
                alert('Book set as Current Read successfully!');
            } else {
                alert('Failed to set the book as Current Read. Please try again.');
            }
        } catch (error) {
            console.error('Error setting book as Current Read:', error);
            alert('An error occurred. Please try again later.');
        }
    };    

    // Handle removing book from TBR shelf
    // This function sends a request to the server to remove the book from the TBR shelf
    const handleRemoveBook = async (cover) => {
        const userId = localStorage.getItem('userId');
    
        if (!userId) {
            alert('You must log in to remove books from your TBR shelf.');
            return;
        }
    
        if (!cover.book_id) {
            alert('This book does not have a valid ID.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5000/api/deleteBookFromTBR', {
                userId,
                bookId: cover.book_id,
            });
    
            if (response.data.success) {
                setCovers(prevCovers => prevCovers.filter(item => item.book_id !== cover.book_id));
                alert('Book removed from TBR shelf successfully!');
            } else {
                alert('Failed to remove the book. Please try again.');
            }
        } catch (error) {
            console.error('Error removing book from TBR shelf:', error);
            alert('An error occurred. Please try again later.');
        }
    };
    
    return (
        <div className="titles">
            <div className="titleandimage">
                <h1>TsundokuBR</h1>
                <div className="logo"></div>
            </div>
           <h2>TBR Shelf</h2>
            {/* Grid of Book Covers */}
            <div className="book-cover-grid">
                {covers.map((cover, index) => (
                    <div key={index} className="book-container">
                        <img
                            src={cover.cover}
                            alt={`Book Cover ${index + 1}`}
                            className="book-cover"
                            onClick={() => handleCoverClick(cover)}
                        />
                        {/* Conditionally render Add to Read Shelf button */}
                        {selectedCover === cover && (
                            <>
                            <button
                            className="tbr-button"
                            onClick={() => handleAddToReadShelf(cover)}
                            >FINISH READING
                            </button>
                            <button
                            className="tbr-button"
                            onClick={() => handleSetAsCurrentRead(cover)}
                            >SET AS MY CURRENT READ
                            </button>
                            <button
                            className="tbr-button"
                            onClick={() => handleRemoveBook(cover)}
                            >REMOVE BOOK
                            </button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="navbar">
                <Link to="/searchcomponent" className="nav-button">Search for a Book</Link>
                <Link to="/readshelf" className="nav-button">Read Shelf</Link>
            </div>

            {/* Dashboard Button */}
            <Link to="/dashboard" className="button-main-control">Dashboard</Link>
        </div>
    );
}

export default TBRShelf;