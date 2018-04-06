// Set up Mongoose
const mongoose = require('mongoose');

// Set up Schema constructor
const Schema = mongoose.Schema;

// Set up NoteSchema
const NoteSchema = new Schema({
  title: String,
  body: String
});

// Create model using ArticleSchema
const Note = mongoose.model('Note', NoteSchema);

// Export Article model
module.exports = Note;
