const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    createdAt : {
        type: Date,
        required: true,
        default: Date.now
    },
    pageCount : {
        type: Number,
        required: true
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author"
    },
    coverImageName : {
        type: String,
        required: true
    }
});

const Book = mongoose.model("Book",bookSchema);

module.exports = Book;