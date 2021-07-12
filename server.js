if(process.env.NODE_ENV !== "production") {   // value of NODE_ENV will be production when deployed to Heroku
    require("dotenv").config();               // implies that we are using .env of local repo when not in production 
}

const express = require("express");
const ejs = require("ejs");
const expressEjsLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const authorRouter = require("./routes/author");

const app = express();
const PORT = process.env.PORT || 3000;  // process.env.PORT will be populated by Heroku

mongoose.connect(process.env.DATABASE_URL,{   // DATABASE_URL will be set with mongoDB cluster in heroku
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})
.then(() => {
    console.log("Connected to mongodb");
})
.catch((err) => {
    console.log(err.message);
    process.exit(1);
})

app.set("view engine","ejs");
app.set("layout","layouts/layout");

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(expressEjsLayouts);
app.use("/",indexRouter);
app.use("/authors",authorRouter);

app.listen(PORT,() => {
    console.log("Server started running...");
})