const mongoose = require("mongoose");

//BOOK SCHEMA
const BookSchema = mongoose.Schema({
    isbn : String,
    title: String,
    pubDate: String,
    language: String,
    numPage: Number,
    authors: [Number],
    publications: Number,
    category: [String]
});

//Creating Book Model
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;























