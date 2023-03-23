const express = require('express');
const fetchUser = require("../middleware/fetchUser");
const Notes = require('../model/Notes');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const User = require('../model/User');

// route 1: fetch notes   /api/auth/fetchNotes

router.get('/fetchNotes',  async (req, res) => {
try {
    const notes = await Notes.find().sort({ Date: -1 });
    res.json(notes)
} catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error in notes fetch");
   }

});

// fetch allnotes (public)

router.get('/fetchAllNotes',  async (req, res) => {
    try {
        const notes = await Notes.find().sort({ Date: -1 }); 
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error in notes fetch");
       }
    
    });

//add noteee
    router.post('/addNote', fetchUser, [
      body('title', 'Title length must be at least 3 characters').isLength({ min: 3 }),
      body('description', 'Description length must be at least 5 characters').isLength({ min: 5 }),
      body('expectation', 'Expectation field is required').isLength({ min: 5 }),
    ], async (req, res) => {
      try {
        const { title, description, expectation, tags } = req.body;
    
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        // Find the user with the given auth-token
        const user = await User.findById(req.user.id);
    
        const note = new Notes({
          name: user.name, // Add the user's name
          user: req.user.id,
          title,
          description,
          expectation,
          tags
        });
    
        const saveNote = await note.save();
    
        console.log( 'successfully added notes:', saveNote);
        res.json({  message: 'Successfully added note' });
    
      }  catch (error) {
        console.log("Error occurred while adding note:", error.message);
        console.error(error.message);
        console.log("Error occurred while adding note:", error.message);
        res.status(500).send('Internal server error in notes add');
      }
    });
    
    


// route 3: update notes   /api/auth/updateNote

router.put('/updateNote/:id', fetchUser, async (req, res) => {
    
try {

const { description, title, tags} = req.body;

const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}

const NewNote = {};
if(title){NewNote.title=title}
if(description){NewNote.description=description}
if(tags){NewNote.tags=tags}

let note = await Notes.findById(req.params.id);
if(!note){
    res.status(404).send("not found")
}
if(note.user.toString() !== req.user.id){
    return res.status(401).send("unAuthorised");
}
 note = await Notes.findByIdAndUpdate(req.params.id, {$set:NewNote}, {new:true});
 res.json(note)

}   catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error in notes update");
   }

});




// route 4: delete notes   /api/auth/deleteNote

router.delete('/deleteNotes/:id', fetchUser,  async (req, res) => {


try {
    

let note = await Notes.findById(req.params.id);
if(!note){
    res.status(404).send("not found")
}
if(note.user.toString() !== req.user.id){
    return res.status(401).send("unAuthorised");
}
 note = await Notes.findByIdAndDelete(req.params.id)
 res.json({"success" : "note has been deleted succesfullly"})

}   catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error in notes delete");
   }

})





module.exports = router;
