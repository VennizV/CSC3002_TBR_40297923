/*
 Author Class Constructor
 @param {string} authorID - Unique identifier for the author
 @param {string} name - Name of the author
*/
class Author {
    constructor(authorID, name) {
      this.authorID = authorID;
      this.name = name;
    }

    /*
     Method to convert Google Books API data to Author object
     @param {object} data - Data from Google Books API
     @returns {Author} - Author object created from Google Books API data
    */
    static fromGoogleBooks(names) {
      return names.map((name, index) => new Author(index + 1, name));
    }
  }
  
  module.exports = Author;  