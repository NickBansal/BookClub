var mongoose = require("mongoose");


var bookSchema = new mongoose.Schema({
    name: String, 
    image: String,
    writer: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: String,
    },
    review: String,
    created: {type: Date, default: Date.now}, 
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ]
});


module.exports = mongoose.model("Book", bookSchema);

