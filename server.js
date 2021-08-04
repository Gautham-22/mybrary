if(process.env.NODE_ENV !== "production") {   // value of NODE_ENV will be production when deployed to Heroku
    require("dotenv").config();               // implies that we are using .env of local repo when not in production 
}
const express = require("express");
const ejs = require("ejs");
const expressEjsLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");

const app = express();
const PORT = process.env.PORT || 3000;  // process.env.PORT will be populated by Heroku

app.set("view engine","ejs");
app.set("layout","layouts/layout");  // changing default location of layout to layouts/layout (used by expressEjsLayouts)

const mongoose = require("mongoose");
let indexRouter, authorRouter, bookRouter;
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser:true,
    useFindAndModify:false
})
.then(() => {           // makes sure that routes & models are loaded and used after connection
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
app.use(express.urlencoded({extended:false, limit : "50mb"}));
app.use(express.json());
app.use(expressEjsLayouts);          // by default, it will look for layout.ejs under views folder for each render     
app.use(methodOverride("_method"));  // overrides the method of the http request with value of query "_method" if present

app.listen(PORT,() => {
    console.log("Server started running...");
})