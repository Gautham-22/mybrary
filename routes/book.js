const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

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
    renderBook(res, "new", book, null);  // 3rd parameter is error if any
});

router.get("/:id",async (req,res) => {
    try {
        const book = await Book.findById(req.params.id).populate("author").exec();
        if(book) {
            res.render("books/show", {book : book, error : null});
        }else {
            res.redirect("/books");
        }
    } catch {
        res.redirect("/books");
    }
});

router.get("/:id/edit",async (req,res) => {
    try {
        const book = await Book.findById(req.params.id);
        renderBook(res, "edit", book, null);
    } catch {
        res.redirect("/books");
    }
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
        renderBook(res, "new", newBook, {msg : "Error while creating a book."});
    }
});

router.put("/:id",async (req,res) => {
    let book;
    try {
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.description = req.body.description;
        book.pageCount = req.body.pageCount;
        book.author = req.body.author;
        book.publishDate = new Date(req.body.publishDate);
        let cover = req.body.cover ? JSON.parse(req.body.cover) : null;
        if(cover != null && imageMimeTypes.includes(cover.type)) {
            book.coverImage = new Buffer.from(cover.data,"base64");
            book.coverImageType = cover.type;
        } 
        await book.save();
        res.redirect(`/books/${req.params.id}`);
    } catch(err) {
        console.log(err);
        if(book) {
            renderBook(res, "edit", book, {msg : "Error while updating the book."});
        } else {
            res.redirect("/books");
        }
    }
});

router.delete("/:id",async (req,res) => {
    let book;
    try {
        book = await Book.findById(req.params.id);
        await book.remove();
        res.redirect("/books");
    } catch(err) {
        if(book) {
            res.render("books/show",{
                book : book,
                error : {msg : err.message}
            });
        }else {
            res.redirect("/");
        }
    }
});

async function renderBook(res, type, book, error) {
    const authors = await Author.find({});
    if(type == "edit") {
        res.render("books/edit",{
            authors : authors,
            book : book,
            error : error
        }) 
    } else {
        res.render("books/new",{
            authors : authors,
            book : book,
            error : error
        })
    }
}

module.exports = router;