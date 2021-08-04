const express = require("express");
const router = express.Router();
const Book = require("../models/book");

// Home page with recent books
router.get("/",async (req,res) => {
    let books;
    try {
        books = await Book.find().sort({createdAt : "desc"}).limit(10).exec();  // sorting in descending order of books creation
    } catch {
        books = [];
    }
    res.render("index",{books : books});
});

module.exports = router;