var mongoose    = require("mongoose");
var Book        = require("./models/book");
var Comment     = require("./models/comment");
 

function seedDB(){
    // REMOVE ALL BLOG POSTS
    Book.remove({}, function(err){
        if (err) {
            console.log(err);
        }
        console.log("Database is deleted!");
    });  
};

module.exports = seedDB;
