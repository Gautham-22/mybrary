const mongoose = require("mongoose");
const Book = require("./book");

const authorSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    }
});

authorSchema.pre("remove",function(next) {  // a middleware that will be executed before remove function
    Book.find({author : this.id},(err,books) => {
        if(err) {
            next(err);
        } else if(books.length > 0) {  
            next(new Error("Cannot delete an author who owns books.")); 
        } else {
            next();
        }
    });
});

const Author = mongoose.model("Author",authorSchema);

module.exports = Author;