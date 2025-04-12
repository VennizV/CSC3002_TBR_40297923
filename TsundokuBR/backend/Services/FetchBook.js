const axios = require('axios');
const Book = require('../Classes/Book');

const apiKey = "AIzaSyAD7TkyOKFbutGV1MnJW3wkEz2TnrNv3rA";
const maxResultsPerPage = 40;

/*
    This function fetches books from the Google Books API based on a search query.
    It supports pagination by allowing a start index to be specified.
    The function returns an array of book items.

    @param {string} query - The search query for the books.
    @param {number} startIndex - The index to start fetching results from.
    @returns {Promise<Array>} - A promise that resolves to an array of book items.
*/
async function fetchBooks(query, startIndex = 0) {
    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResultsPerPage}&startIndex=${startIndex}&key=${apiKey}`);
        return response.data.items || [];
    } catch (error) {
        console.error(`Error fetching books: ${error}`);
        throw error;
    }
}

/*
    This function searches for books using a query string.
    It fetches books in batches of maxResultsPerPage until no more books are found.
    The function returns an array of all found books.

    @param {string} query - The search query for the books.
    @returns {Promise<Array>} - A promise that resolves to an array of all found books.
*/
async function searchBooks(query) {
    let books = [];
    let startIndex = 0;
    let newBooks = [];

    do {
        newBooks = await fetchBooks(query, startIndex);
        books = books.concat(newBooks);
        startIndex += maxResultsPerPage;
    } while (newBooks.length > 0);

    return books;
}

/*
    This function searches for books by title using the Google Books API.
    It formats the results into Book objects and returns them.

    @param {string} title - The title of the book to search for.
    @returns {Promise<Array>} - A promise that resolves to an array of Book objects.
*/
async function searchBooksByTitle(title) {
    try {
        const books = await searchBooks(`intitle:${title}`);
        const formattedBooks = books.map(item => Book.fromGoogleBooks(item));

        console.log('Books Found by Title:', formattedBooks);
        return formattedBooks;
    } catch (error) {
        console.error(`Error searching for books by title: ${error}`);
        throw error;
    }
}

/*
    This function searches for books by author using the Google Books API.
    It formats the results into Book objects and returns them.

    @param {string} author - The author of the book to search for.
    @returns {Promise<Array>} - A promise that resolves to an array of Book objects.
*/
async function searchBooksByAuthor(author) {
    try {
        const books = await searchBooks(`inauthor:${author}`);
        const formattedBooks = books.map(item => Book.fromGoogleBooks(item));

        console.log('Books Found by Author:', formattedBooks);
        return formattedBooks;
    } catch (error) {
        console.error(`Error searching for books by author: ${error}`);
        throw error;
    }
}

module.exports = {
    searchBooksByTitle,
    searchBooksByAuthor,
    fetchBooks,
    searchBooks
};
