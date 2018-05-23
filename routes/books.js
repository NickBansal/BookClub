var express     = require("express"),
    router      = express.Router(),
    middleware  = require("../middleware"),
    Book        = require("../models/book");



// INDEX ROUTE - Show all books

router.get("/", function(req, res){
    var perPage = 12;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Book.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, book) {
            Book.count({name: regex}).exec(function (err, count) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if(book.length < 1) {
                        noMatch = "No campgrounds match that query, please try again.";
                    }
                    res.render("books/index", {
                        book: book,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: req.query.search
                    });
                }
            });
        });
    } else {
        // get all campgrounds from DB
        Book.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, book) {
            Book.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("books/index", {
                        book: book,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: false
                    });
                }
            });
        });
    }
});


// CREATE ROUTE - create new book to DB

router.post("/", middleware.isLoggedIn, function(req, res){
    var name    = req.body.name,
        image   = req.body.image,
        writer  = req.body.writer,
        review  = req.body.review;
    var author = {
        id: req.user._id,
        username: req.user.username,
    };  
    
    var newBook = {name: name, image: image, review: review, writer: writer, author: author};
    
    Book.create(newBook, function(err, book){
        if (err) {
            console.log(err);
        } else {
            // console.log(book);
            res.redirect("/books");        
        }
    });
});


// NEW ROUTE - Show form for new book

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("books/new");
})


// SHOW ROUTE

router.get("/:id", function(req, res){
    Book.findById(req.params.id).populate("comments").exec(function(err, foundBook){
        if (err) {
            res.redirect("/books");
        } else {
            res.render("books/show", {book: foundBook});    
        }
    });
});


// EDIT ROUTE

router.get("/:id/edit", middleware.checkBookOwnership, function(req, res){
    Book.findById(req.params.id, function(err, book){
        res.render("books/edit", {book: book});    
    });
});


// UPDATE ROUTE

router.put("/:id", middleware.checkBookOwnership, function(req, res){
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook){
        if (err) {
            res.redirect("/books");
        } else {
            req.flash("success", "Successfully updated");
            res.redirect("/books/" + req.params.id);
        }
    });
});


// DELETE ROUTE

router.delete("/:id", middleware.checkBookOwnership, function(req, res){
    Book.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/books");
        } else {
            req.flash("success", "Book successfully deleted");
            res.redirect("/books");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;