const { response } = require("express");
const express = require("express");
const { request } = require("http");

var bodyParser = require("body-parser");

//Database
const database = require("./Database");

//Body-parser
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

//Intialize express
const booky = express();

//API to access the books
/*
Route          /
Description    Get all books
Access         public
Parameter      none
Methods        GET
 */
booky.get("/", (request, response) => {
    return response.json({data: database.books});
});


//API to get specific book based on isbn number   localhost:3000/1234book
/*
Route          /is 
Description    Get specific book based on ISBN no.
Access         public
Parameter      ISBN
Methods        GET
 */
booky.get("/is/:isbn", (request, response) => {
    const getSpecificBook = database.books.filter(
        (book) => book.isbn === request.params.isbn
    );

    if (getSpecificBook.length === 0){
        return response.json({
            error: `No book found with ISBN of ${request.params.isbn}`
        });
    }
    
    return response.json({book: getSpecificBook});
});


//API to get a book on a specific category
/*
Route          /c
Description    Get specific book based a category
Access         public
Parameter      Category
Methods        GET
 */
booky.get("/c/:category", (request, response) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(request.params.category)
    );

    if (getSpecificBook.length === 0){
        return response.json({
            error: `No book found with category of ${request.params.category}`
        });
    }
    
    return response.json({book: getSpecificBook});
});


//API to get all Authors
/*
Route          /author
Description    Get all authors
Access         public
Parameter      none
Methods        GET
 */
booky.get("/authors", (request, response) => {
    return response.json({authors : database.authors})
});


//API to get all Authors based on specific book
/*
Route          /author/book
Description    Get all authors based on a book
Access         public
Parameter      isbn
Methods        GET
 */
booky.get("/author/book/:isbn", (request, response) => {
    const getSpecificAuthor = database.authors.filter(
        (author) => author.books.includes(request.params.isbn)
    );

    if (getSpecificAuthor.length === 0){
        return response.json({
            error: `No book found for isbn of ${request.params.isbn} name`
        });
    }
    
    return response.json({authors: getSpecificAuthor});
});


//API TO GET PUBLICATIONS
/*
Route          /publications
Description    Get all publications
Access         public
Parameter      none
Methods        GET
 */
booky.get("/publications", (request, response) => {
    return response.json({publications: database.publications});
});



//         POST REQUEST
//Add new books
/*
Route          /book/new
Description    add new books
Access         public
Parameter      none
Methods        POST
 */

booky.listen(3000, () => console.log("The server is up & running"));