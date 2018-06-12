var Book        = require("../models/book"),
    flash       = require("connect-flash"),
    Comment     = require("../models/comment"),
    Rating      = require("../models/rating");



var middlewareObj = {};

middlewareObj.checkBookOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Book.findById(req.params.id, function(err, book){
            if (err) {
                req.flash("error", "Book not found");
                res.redirect("back");
            } else {
                if (book.author.id.equals(req.user._id)) {
                    next();    
                } else {
                    req.flash("error", "This aint your book bruh! You don't have permission!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
}


middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, comment){
            if (err) {
                res.redirect("back");
            } else {
                if (comment.author.id.equals(req.user._id)) {
                    next();    
                } else {
                    req.flash("error", "This aint your comment bruh! You don't have permission!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next(); 
    }
    req.flash("error", "You need to be logged in");
    res.redirect("/login")
};

middlewareObj.checkRatingExists = function(req, res, next){
  Book.findById(req.params.id).populate("ratings").exec(function(err, book){
    if(err){
      console.log(err);
    }
    for(var i = 0; i < book.ratings.length; i++ ) {
      if(book.ratings[i].author.id.equals(req.user._id)) {
        req.flash("success", "You already rated this!");
        return res.redirect('/books/' + book._id);
      }
    }
    next();
  })
}

module.exports = middlewareObj;