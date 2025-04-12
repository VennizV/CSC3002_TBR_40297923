const Author = require('./Author');

/*
 Book Class Constructor
 @param {string} bookID - Unique identifier for the book
 @param {string} title - Title of the book
 @param {Array} authors - Array of authors associated with the book
 @param {string} description - Description of the book
 @param {string} cover - URL of the book cover image
 @param {date} publishedDate - Date when the book was published
*/
class Book {
  constructor(bookID, title, authors, description, cover, publishedDate) {
    this.bookID = bookID;
    this.title = title;
    this.authors = authors;
    this.description = description;
    this.cover = cover;
    this.publishedDate = publishedDate;
  }

  /*
   Method to convert Google Books API data to Book object
   @param {object} data - Data from Google Books API
   @returns {Book} - Book object created from Google Books API data
   */
  static fromGoogleBooks(data) {
    const authors = data.volumeInfo.authors
      ? Author.fromGoogleBooks(data.volumeInfo.authors)
      : [new Author(0, 'Unknown Author')]; // Default to 'Unknown Author' if no authors are found
    
    return new Book(
      data.id,
      data.volumeInfo.title,
      authors,
      data.volumeInfo.description,
      data.volumeInfo.imageLinks?.thumbnail,
      data.volumeInfo.publishedDate
    );
  }
}

module.exports = Book;
