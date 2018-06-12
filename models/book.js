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
    ],
    ratings: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Rating"
      }
   ],
   rating: { type: Number, default: 0 }
});


module.exports = mongoose.model("Book", bookSchema);

