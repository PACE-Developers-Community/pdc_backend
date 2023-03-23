const express = require('express');
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require('express-validator');
const Answer = require('../model/Answerschema');
const router = express.Router();

// route 1: fetch answers   /api/auth/fetchAnswers

router.get('/fetchAnswers',  async (req, res) => {
  try {
      const answers = await Answer.find().sort({ Date: -1 });
      res.json(answers)
  } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error in answers fetch");
  }
});

// add answer
router.post('/addAnswer',fetchUser, [
//   body('content', 'Content length must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  try {
    const { content } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const answer = new Answer({
      user: req.user.id,
      content,
      question
    });

    const savedAnswer = await answer.save();

    console.log('Successfully added answer:', savedAnswer);
    res.json({ message: 'Successfully added answer' });

  } catch (error) {
    console.error('Error occurred while adding answer:', error.message);
    res.status(500).send('Internal server error in answers add');
  }
});

// route 3: update answer   /api/auth/updateAnswer

router.put('/updateAnswer/:id', fetchUser, async (req, res) => {

  try {

    const { content } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedAnswer = await Answer.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { content },
      { new: true }
    );

    if (!updatedAnswer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    console.log('Successfully updated answer:', updatedAnswer);
    res.json({ message: 'Successfully updated answer' });

  } catch (error) {
    console.error('Error occurred while updating answer:', error.message);
    res.status(500).send('Internal server error in answers update');
  }
});

// route 4: delete answer   /api/auth/deleteAnswer

router.delete('/deleteAnswer/:id', fetchUser, async (req, res) => {

  try {

    const deletedAnswer = await Answer.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deletedAnswer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    console.log('Successfully deleted answer:', deletedAnswer);
    res.json({ message: 'Successfully deleted answer' });

  } catch (error) {
    console.error('Error occurred while deleting answer:', error.message);
    res.status(500).send('Internal server error in answers delete');
  }
});

module.exports = router;
