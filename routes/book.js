const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");
const path = require("path");

const imageMimeTypes = ["image/png","image/jpeg","image/gif"];

// const multer = require("multer");
// const coverImageDestination = "uploads/coverfiles";
// const uploadPath = path.join("public",coverImageDestination);

// const upload = multer({
//     dest: uploadPath,
//     fileFilter : (req,file,cb) => {
//         console.log("Inside fileFilter : ",file);
//         cb(null,imageMimeTypes.includes(file.mimetype));
//     }
// })

router.get("/",async (req,res) => {
    let query = Book.find();
    if(req.query.title) {
        query = query.regex("title",new RegExp(req.query.title,"i"));          
    }
    if(req.query.publishedBefore) {
        query = query.lte("publishDate",req.query.publishedBefore);          
    }
    if(req.query.publishedAfter) {
        query = query.gte("publishDate",req.query.publishedAfter);          
    }
    try {
        let books = await query.exec();
        res.render("books/index",{books : books, searchOptions : req.query});
    } catch {
        res.redirect("/");
    }
});


router.get("/new",async (req,res) => {
    const book = new Book();
    renderNewBook(res, book, null);  // 3rd parameter is error if any
});

router.post("/",async (req,res) => {
    const newBook = new Book({
        title : req.body.title,
        description : req.body.description,
        publishDate : new Date(req.body.publishDate),
        pageCount : req.body.pageCount,
        author : req.body.author
    });
    let cover = JSON.parse(req.body.cover);
    if(cover != null && imageMimeTypes.includes(cover.type)) {
        newBook.coverImage = new Buffer.from(cover.data,"base64");
        newBook.coverImageType = cover.type;
    } 
    try {
        const book = await newBook.save();
        res.redirect("/books");
    } catch(err) {
        renderNewBook(res, newBook, {msg : "Error while creating a book."});
    }
});

async function renderNewBook(res, book, error) {
    const authors = await Author.find({});
    res.render("books/new",{
        authors : authors,
        book : book,
        error : error
    })
}

module.exports = router;