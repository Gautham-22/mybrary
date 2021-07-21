const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const coverImageDestination = "uploads/coverfiles";
const imageMimeTypes = ["image/png","image/jpeg","image/gif"];
const uploadPath = path.join("public",coverImageDestination);

const upload = multer({
    dest: uploadPath,
    fileFilter : (req,file,cb) => {
        console.log("Inside fileFilter : ",file);
        cb(null,imageMimeTypes.includes(file.mimetype));
    }
})

router.get("/",(req,res) => {
    res.render("books/index");
});

router.get("/new",async (req,res) => {
    const book = new Book();
    renderNewBook(res, book, null);  // 3rd parameter is error if any
});

router.post("/",upload.single("cover"),async (req,res) => {
    const coverImageName = req.file ? req.file.filename : null;
    const newBook = new Book({
        title : req.body.title,
        description : req.body.description,
        publishDate : new Date(req.body.publishDate),
        pageCount : req.body.pageCount,
        author : req.body.author,
        coverImageName : coverImageName
    });
    try {
        const book = await newBook.save();
        console.log("Book created : ",book);
        res.redirect("/books");
    } catch(err) {
        
        // if any error occurred while saving (not due to coverimagename) then we should remove the filename from coverfiles
        if(coverImageName) {
            fs.unlink(path.join(uploadPath,coverImageName),(err) => {
                if(err) {
                    console.log(err);
                }
            });
        }
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