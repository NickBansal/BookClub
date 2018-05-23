var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    passport    = require("passport");


router.get("/", function(req, res){
    res.render("landing");
});


// REGISTER 

router.get("/register", function(req, res) {
    res.render("register");
})

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", user.username + " has successfully registered");
                res.redirect("/books");    
            }); 
        }
    });
});


// LOG IN

router.get("/login", function(req, res){
    // req.flash("error", "Log in mate");
    res.render("login");
});

// app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/books",
    failureRedirect: "/login"
}), function(req, res){});


// LOG OUT

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have successfully logged out");
    res.redirect("/books");
});


module.exports = router;