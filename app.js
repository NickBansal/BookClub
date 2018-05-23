var methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    middleware      = require("./middleware"),
    bodyParser      = require("body-parser"), 
    mongoose        = require("mongoose"),
    express         = require("express"),
    seedDB          = require("./seeds"),
    app             = express();

    
var bookRoutes      = require("./routes/books"),
    commentRoutes   = require("./routes/comments"),
    authRoutes      = require("./routes/auth");


var Book            = require("./models/book"),
    Comment         = require("./models/comment"),
    User            = require("./models/user");

app.locals.moment   = require('moment');

var passport        = require("passport"),
    localStrategy   = require("passport-local");
    
// seedDB();


// APP CONFIG
var url = process.env.DATABASEURL || "mongodb://localhost/book_list";
mongoose.connect(url);



app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Favourite instrument",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// PASS CURRENT-USER TO ALL ROUTES
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// ROUTE CONFIG
app.use("/", authRoutes);
app.use("/books", bookRoutes);
app.use("/books/:id/comments", commentRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});