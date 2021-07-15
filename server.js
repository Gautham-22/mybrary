if(process.env.NODE_ENV !== "production") {   // value of NODE_ENV will be production when deployed to Heroku
    require("dotenv").config();               // implies that we are using .env of local repo when not in production 
}

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL,{   // DATABASE_URL will be populated as mongo cluster by heroku when deployed 
    useNewUrlParser:true,
    useFindAndModify:false
})
.then(() => {
    console.log("Connected to mongodb");
    const express = require("express");
    const ejs = require("ejs");
    const expressEjsLayouts = require("express-ejs-layouts");
    const indexRouter = require("./routes/index");
    const authorRouter = require("./routes/author");

    const app = express();
    const PORT = process.env.PORT || 3000;  // process.env.PORT will be populated by Heroku
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
})
.catch((err) => {
    console.log(err.message);
    process.exit(1);
})
