const mongoose = require('mongoose');
const { Schema } = mongoose;

const AnswerSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'notes'
  },
  content: {
    type: String,
    required: true
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  Date: {
    type: Date,
    default: Date.now
  }
});

const Answer = mongoose.model('answer', AnswerSchema);

module.exports = Answer;
