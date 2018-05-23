var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Book        = require("../models/book"),
    middleware  = require("../middleware"),
    Comment     = require("../models/comment");



// NEW COMMENT ROUTE

router.get("/new", middleware.isLoggedIn, function(req, res){
    Book.findById(req.params.id, function(err, book){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {book: book});
        };
    });
});


// CREATE ROUTE

router.post("/", middleware.isLoggedIn, function(req, res){
    Book.findById(req.params.id, function(err, book){
        if (err) {
            res.redirect("/books");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                   
                    book.comments.push(comment);
                    book.save();
                    req.flash("success", "Comment successfully created!");
                    res.redirect("/books/" + book._id);
                };
            });
        };
    });
});


// EDIT ROUTE

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {book_id: req.params.id, comment: foundComment});
        }
    });
});


// UPDATE ROUTE

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/books/" + req.params.id);
        }
    });
});


// DELETE ROUTE

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted")
            res.redirect("/books/" + req.params.id);
        }
    })
})


module.exports = router;