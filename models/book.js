const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : {     // optional
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    createdAt : {       // storing created time for recent uploads   
        type: Date,
        required: true,
        default: Date.now
    },
    pageCount : {
        type: Number,
        required: true
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,  // id of the author object - acts as link b/n two schemas 
        required: true,
        ref: "Author"
    },
    coverImage : {
        type: Buffer,
        required: true
    },
    coverImageType : {      // later required for converting buffer back to image
        type: String,
        required: true
    }
});

// a virtual property, can be accessed by - book.coverImagePath
bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

const Book = mongoose.model("Book",bookSchema);

module.exports = Book;