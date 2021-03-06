require("dotenv").config();
const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const { request } = require("http");

var bodyParser = require("body-parser");

//Database
const database = require("./Database");

//Importing Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Intialize express
const booky = express();
//Body-parser
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

// Establish database Connection
mongoose.connect(
    process.env.MONGO_URL
).then(() => console.log("Connection is established!!"));

//API to access the books
/*
Route          /
Description    Get all books
Access         public
Parameter      none
Methods        GET
 */
/*
booky.get("/", (request, response) => {
    return response.json({data: database.books});
});
*/

booky.get("/", async (request, response) => {
    const getAllBooks = await BookModel.find();
    return response.json(getAllBooks);
});

//API to get specific book based on isbn number   localhost:3000/1234book
/*
Route          /is 
Description    Get specific book based on ISBN no.
Access         public
Parameter      ISBN
Methods        GET
 */
booky.get("/is/:isbn", async (request, response) => {
    const getSpecificBook = await BookModel.findOne({isbn: request.params.isbn});
    
    if (!getSpecificBook){
        return response.json({
            error: `No book found with ISBN of ${request.params.isbn}`
        });
    }
    return response.json(getSpecificBook);
    /* const getSpecificBook = database.books.filter(
        (book) => book.isbn === request.params.isbn
    ); 
    if (getSpecificBook.length === 0){
        return response.json({
            error: `No book found with ISBN of ${request.params.isbn}`
        });
    }
    return response.json({book: getSpecificBook}); */
});


//API to get a book on a specific category
/*
Route          /c
Description    Get specific book based a category
Access         public
Parameter      Category
Methods        GET
 */
booky.get("/c/:category", async (request, response) => {
    const getSpecificBook = await BookModel.findOne({category: request.params.category});
    //const getSpecificBook = database.books.filter(
        //(book) => book.category.includes(request.params.category));

    /*if no spefic book is returned then the findOne func returns null, and to execute the 
    Not found property we have to make the condition inside if true, !null is true */
    if (!getSpecificBook){
        return response.json({
            error: `No book found with category of ${request.params.category}`
        });
    }
    return response.json({getSpecificBook});
});

//API to get a list of books based on languages
/*
Route          /book/:language
Description    Get list of books based on languages
Access         public
Parameter      language
Methods        GET
*/
booky.get("/book/:language", (request, response) => {
    const specificLanguageBook = database.books.filter(
        (book) => book.language.includes(request.params.language)
    );

    if (specificLanguageBook.length === 0){
        return response.json({
            error: `No book found with language of ${request.params.language}`
        });
    }
    
    return response.json({book: specificLanguageBook});
});



//API to get all Authors
/*
Route          /author
Description    Get all authors
Access         public
Parameter      none
Methods        GET
 */
booky.get("/authors", async (request, response) => {
    const getAllAuthors = await AuthorModel.find();
    return response.json(getAllAuthors);
});


//API to get all Authors based on specific book
/*
Route          /author/book
Description    Get all authors based on a book
Access         public
Parameter      isbn
Methods        GET
*/
booky.get("/author/book/:isbn", async (request, response) => {
    const getSpecificAuthor = await AuthorModel.findOne({books: request.params.isbn});
    /*const getSpecificAuthor = database.authors.filter(
        (author) => author.books.includes(request.params.isbn)
    ); */

    if (!getSpecificAuthor){
        return response.json({
            error: `No book found for isbn of ${request.params.isbn} name`
        });
    }   
    return response.json(getSpecificAuthor);
});

//API to get a list of authors based on books --> to change
/*
Route          /author/book
Description    get a list of authors based on books
Access         public
Parameter      isbn
Methods        GET
*/
booky.get("authors/:isbn", (request, response) => {
    const authorsList = database.authors.filter(
        (author) => author.books.includes(request.params.isbn)
    );

    if(authorsList.length === 0){
        return response.json({
            error: `No authors found with book ${request.params.isbn}`
        })
    }
    return response.json({author: database.authorsList});
});


//API TO GET PUBLICATIONS
/*
Route          /publications
Description    Get all publications
Access         public
Parameter      none
Methods        GET
 */
booky.get("/publications", async (request, response) => {
    const getAllPublication = await PublicationModel.find();
    return response.json(getAllPublication);
    //return response.json({publications: database.publications});
});


//GET SPECIFIC PUBLICATION
/*
Route          /p/publications
Description    GET SPECIFIC PUBLICATION
Access         Public
Parameters     id
Methods        GET
*/
booky.get("/p/publications/:id", async(req, res) => {
    const getapub = await PublicationModel.findOne({ id: req.params.id })
    if (!getapub) {
        return res.json({
            error: `No publication found for id of ${req.params.id}`
        });
    }
    return res.json(getapub);
});


//  --------- POST REQUEST ---------- 
//Add new books
/*
Route          /book/new
Description    add new books
Access         public
Parameter      none
Methods        POST
*/
booky.post("/book/new", async (request, response) => {
    const { newBook } = request.body; 
    const addNewBook = BookModel.create(newBook);
    //database.books.push(newBook);
    return response.json({
        books: addNewBook,
        message: "Book was added!"
    });
});



//Add new authors
/*
Route          /authors/new
Description    add new books
Access         public
Parameter      none
Methods        POST
*/
booky.post("/authors/new", async (request, response) => {
    const { newAuthor } = request.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    //database.authors.push(newAuthors);
    return response.json({
        author: addNewAuthor,
        message: "Author added successfully!!"
    });
});



//Add new Publication
/*
Route          /publication/new
Description    add new publication
Access         public
Parameter      none
Methods        POST
*/
booky.post("/publications/new", (request, response) => {
    const newPublications = request.body;
    database.publications.push(newPublications);
    return response.json({updatedPublications: database.publications});
});

//Update a book title
/*
Route          /book/update
Description    add new publication
Access         public
Parameter      isbn
Methods        PUT
*/
booky.put("/book/update/:isbn", async (request, response) => {
    const updatedBooks = await BookModel.findOneAndUpdate(
        {
            isbn: request.params.isbn //condition to check the target book which we're going to update
        },
        {
            title: request.body.bookTitle // which parameter we want to update : and updated value
        },
        {
            new: true // If we want to return the updated object then we write true
        }
    );
    return response.json({books: database.books});
});


//   ------------PUT REQUEST -----------------------
//Update Publications and books
/*
Route          /publications/update/book
Description    update publications and books
Access         public
Parameter      isbn
Methods        PUT
*/
booky.put("/publications/update/book/:isbn", (request, response) => {
    //update the publication database
    database.publications.forEach((pub) => {
        if(pub.id === request.body.pubID){
            return pub.books.push(request.params.isbn);
        }
    });

    //update the books database
    database.books.forEach((book) => {
        if(book.isbn == request.params.isbn){
            book.publications = request.body.pubID;
            return;
        }
    });

    return response.json({
        books: database.books,
        publications : database.publications,
        message: "Successfully updated!"
    })
});


// ---------DELETE REQUEST----------------
//Delete a book
/*
Route          /book/delete
Description    Delete a book
Access         public
Parameter      isbn
Methods        DELETE
*/
booky.delete("/book/delete/:isbn", async (request, response) => {
    const updatedBookDatabase = await BookModel.findOneAndDelete({
        isbn: request.params.isbn
    });
    /* const updateBookDatabase = database.books.filter(
        (book) => book.isbn !== request.params.isbn
    )
    database.books = updateBookDatabase; */
    return response.json({books: updatedBookDatabase});
});

//Delete an author from a book and a vice versa
/*
Route          /book/delete/author
Description    Delete an author from a book & vice versa
Access         public
Parameter      isbn, authorId
Methods        DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", async (request, response) => {
    //Update the book Database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            isbn: request.params.isbn
        },
        {
            $pull:
            {
                authors: parseInt(request.params.authorId)
            },
        },
        {
            new: true
        }
    )
    /* database.books.forEach((book) => {
        if(book.isbn === request.params.isbn){
            const newAuthorList = book.authors.filter(
              (eachAuthor) => eachAuthor !== parseInt(request.params.authorId)  
            );
            book.authors = newAuthorList;
            return;
        }
    }); */

    //Update the author Database
    database.authors.forEach((eachAuthor) => {
        if(eachAuthor.id === parseInt(request.params.authorId)){
            const newBookList = eachAuthor.books.filter(
                (book) => book !== request.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    });

    return response.json({
        books: database.books,
        author: database.authors,
        message: "Author & Book were successfully deleted!!"
    });
});


booky.listen(3000, () => console.log("The server is up & running"));