const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name :{
    type :String,
},
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  expectation: {
    type: String,
    required: true
  },

  tags: {
    type: [String],
    required: true
  },

  Date: {
    type: Date,
    default: Date.now
  }
});

const Notes = mongoose.model('notes', NotesSchema);

module.exports = Notes;
