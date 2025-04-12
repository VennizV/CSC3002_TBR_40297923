import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../components/Body.css';
import '../components/NavButtons.css';
import '../components/Button.css';
import '../components/Titles.css';
import '../components/Search.css';

const SearchComponent = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searchType, setSearchType] = useState('title');
    const [selectedBook, setSelectedBook] = useState(null);

    // Handle search functionality
    const handleSearch = async () => {
        try {
            let url = '';
            if (searchType === 'title') {
                url = `http://localhost:5000/title?title=${query}`;
            } else if (searchType === 'author') {
                url = `http://localhost:5000/author?author=${query}`;
            }
            const response = await axios.get(url);
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    // Handle book selection
    const handleBookClick = (book) => {
        setSelectedBook(book);
    };

    // Handle adding book to TBR
    const handleAddToTBR = async (book) => {
        const userId = localStorage.getItem('userId');
    
        if (!userId) {
            alert('You must log in to add books to your TBR.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5000/api/addBookToTBR', {
                userId,
                bookData: book
            });
    
            if (response.data.success) {
                alert('Book added to TBR successfully!');
            } else {
                alert('Failed to add the book. Please try again.');
            }
        } catch (error) {
            console.error('Error adding book to TBR:', error);
            alert('An error occurred. Please try again later.');
        }
    };    
    

    return (
        <div className="titles">
            <div className="titleandimage">
                <h1>TsundokuBR</h1>
                <div className="logo"></div>
            </div>
           <h2>Book Search</h2>

            {/* Search input */}
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter a title or author..." className="search-input"/>
            <select className="custom-dropdown" onChange={(e) => setSearchType(e.target.value)}>
            <option value="title">Title</option>
            <option value="author">Author</option>
            </select>

            <button onClick={handleSearch} className="search-button">Search</button>

            {/* Link to dashboard */}
            <Link to="/dashboard" className="button-main-control">Dashboard</Link>

            {/* Display search results */}
            <div className="results-container">
                {results.map((result, index) => (
                    <div key={index} className="book-container" onClick={() => handleBookClick(result)}>
                        {result.cover && <img src={result.cover} alt={result.title} />}
                        <h3>{result.title}</h3>
                        {result.authors && result.authors.map((author, index) => (
                            <p key={index}>by {author.name}</p>
                        ))}
                        <p>{result.description}</p>
                        <p><b>{result.publishedDate}</b></p>
                        {selectedBook === result && (
                            <button onClick={() => handleAddToTBR(result)}>Add to TBR</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchComponent;
