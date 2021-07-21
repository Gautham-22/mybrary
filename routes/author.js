const express = require("express");
const router = express.Router();

const Author = require("../models/author");

// Authors route for showing and searching existing users
router.get("/",async (req,res) => {
    let options = {};
    if(req.query.name) {
        options.name = new RegExp(req.query.name,"i");
    }
    try {
        const authors = await Author.find(options);
        res.render("authors/index",{authors});
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

// Handles form submission of "/new"
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

module.exports = router;