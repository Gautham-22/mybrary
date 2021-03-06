const express = require("express");
const router = express.Router();

const Author = require("../models/author");
const Book = require("../models/book");

// Authors route for showing and searching existing users
router.get("/",async (req,res) => {
    let options = {};
    let searchOptions = { name : "" };
    if(req.query.name) {
        options.name = new RegExp(req.query.name,"i"); // case insesitive regular expression
        searchOptions.name = req.query.name;
    }
    try {
        const authors = await Author.find(options);
        res.render("authors/index",{authors, searchOptions});
    } catch(err) {
        res.redirect("/");
    }
});

// form for adding a new author
router.get("/new",async (req,res) => {
    const author = await new Author(); 
    res.render("authors/new",{
        author : author,
        error : null
    });
});

// for viewing the author
router.get("/:id",async (req,res) => {
    try {
        const author = await Author.findById(req.params.id); 
        const books = await Book.find({author : req.params.id}).limit(10).exec();
        res.render("authors/show",{
            author : author,
            booksByAuthor : books,
            error : null
        });
    } catch {
        res.redirect("/authors");
    }
});

// for displaying the edit form for author
router.get("/:id/edit",async (req,res) => {
    try {
        const author = await Author.findById(req.params.id); 
        res.render("authors/edit",{author : author, error : null});
    } catch {
        res.redirect("/authors");
    }
});

// Handles form submission of "/authors/new"
router.post("/",async (req,res) => {
    const newAuthor = new Author({name : req.body.name});
    try {
        const author = await newAuthor.save();
        console.log("Author created : ",author);
        res.redirect("/authors");
    } catch(err) {
        res.render("authors/new",{
            author : newAuthor,
            error : {msg : "Error while creating an author."}
        });
    }
});

// updates author
router.put("/:id",async (req,res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);
    } catch {
        if(author) {
            res.render("authors/edit",{
                author : author, 
                error : {
                    msg : "Error while updating the author!"
                }
            });
        }else {
            res.redirect("/");
        }
    }
})

// deletes author
router.delete("/:id",async (req,res) => { 
    let author, books;
    try {
        author = await Author.findById(req.params.id);
        books = await Book.find({author : req.params.id}).limit(10).exec();
        await author.remove();
        res.redirect("/authors");
    } catch(err) {
        if(author) {
            res.render("authors/show",{
                author : author,
                booksByAuthor : books,
                error : {msg : err.message}
            });
        }else {
            res.redirect("/");
        }
    }
})

module.exports = router;