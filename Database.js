const books = [
    {
        isbn : "1234Book",
        title: "Getting started with API",
        pubDate: "2021-04-12",
        language: "en",
        numPage: 250,
        authors: [1,2],
        publications: [1],
        category: ["education", "tech", "novel", "fantasy"]
    }
    // {
    //     isbn : "Wings of Fire",
    //     title: "Getting started with API",
    //     pubDate: "2021-04-13",
    //     language: ["English", "Hindi", "Marathi"],
    //     numPage: 250,
    //     authors: [1,2],
    //     publications: [1],
    //     category: ["Dreamy", "tech", "funny", "fantasy"]
    // }
];

const authors= [
    {
        id: 1,
        name: "APJ Abdul Kalam Sir",
        books: ["Wings of Fire", "1234Book"]
    },
    {
        id: 2,
        name: "Robert T. Kiyosaki",
        books: ["Rich Dad Poor Dad"]
    }
];

const publications = [
    {
        id: 1,
        name: "Rich Dad Poor Dad",
        books: ["1234Book"]
    },
    {
        id: 2,
        name: "Rich Dad Poor Dad2",
        books: []
    }
];

// to export the database
module.exports = {books, authors, publications};