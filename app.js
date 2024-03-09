const express = require("express")
const app = express();
const ejs = require("ejs")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const Listing = require("./models/listing.js");
const wrapAsynch = require("./utils/wrapAsych.js")
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const users = require("./routes/users.js")
const path = require("path");
const ejsMate = require("ejs-mate");
const { wrap } = require("module");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStatergy = require("passport-local");
const user = require("./models/user.js");
const MongoUrl = 'mongodb://127.0.0.1:27017/wanderlust'
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json())
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")));



const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStatergy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
main()
    .then(() => {
        console.log("db is successfully connnected")
    })
    .catch((err) => {
        console.log(err)
    })

async function main() {
    await mongoose.connect(MongoUrl);
}


app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
})

// Index route
app.get("/listings", wrapAsynch(async (req, res) => {
    let allListings = await Listing.find({})
    res.render("./listings/index.ejs", {
        allListings
    })
}))

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)
app.use("/", users)


// error handling middleware
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "page not found"));
})

app.use((err, req, res, next)=>{
    let {status=500, message="something went wrong"} = err;
    res.render("./listings/error.ejs", {err});
})

app.get("/", (req, res) => {
    res.send("hello i m root and index route is running successfully")
})

app.listen(8080, () => {
    console.log("server is running to port 8080");
})

