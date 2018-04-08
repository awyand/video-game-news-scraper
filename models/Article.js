// Set up Mongoose
const mongoose = require('mongoose');

// Set up Schema constructor
const Schema = mongoose.Schema;

// Set up ArticleSchema
const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  numComments: {
    type: Number
  },
  numStars: {
    type: Number
  },
  imageLink: {
    type: String
  },
  dateTime: {
    type: String
  },
  saved: {
    type: Boolean
  },
  author: {
    type: String
  }
});

// Create model using ArticleSchema
const Article = mongoose.model('Article', ArticleSchema);

// Export Article model
module.exports = Article;
