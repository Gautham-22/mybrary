if(process.env.NODE_ENV !== "production") {   // value of NODE_ENV will be production when deployed to Heroku
    require("dotenv").config();               // implies that we are using .env of local repo when not in production 
}
const express = require("express");
const ejs = require("ejs");
const expressEjsLayouts = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || 3000;  // process.env.PORT will be populated by Heroku

app.set("view engine","ejs");
app.set("layout","layouts/layout");

const mongoose = require("mongoose");
let indexRouter, authorRouter, bookRouter;
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser:true,
    useFindAndModify:false
})
.then(() => {           // makes sure that models are loaded and used after connection
    console.log("Connected to mongodb"); 
    indexRouter = require("./routes/index");           
    authorRouter = require("./routes/author");
    bookRouter = require("./routes/book");
    app.use("/",indexRouter);                           
    app.use("/authors",authorRouter);
    app.use("/books",bookRouter);
})
.catch((err) => {
    console.log(err.message);
    process.exit(1);
})

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(expressEjsLayouts);

app.listen(PORT,() => {
    console.log("Server started running...");
})