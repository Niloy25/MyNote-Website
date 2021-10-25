const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// ROUTE: 1 Get All the Notes using: GET "/api/note/fetchallnotes". Login required  
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

// ROUTE: 2 Add a New Note using: POST "/api/note/addnote". Login required  
router.post('/addnote', fetchuser, [
    body('title', "Enter A Valid Title").isLength({ min: 3 }),
    body('description', "Description Can't be Be Atleast 5 Characters").isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // If there are Errors, return Bad Request and the Errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

// ROUTE: 3 Update an Exsisting Note using: PUT "/api/note/updatenote". Login required  
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create a newNote Object 
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the Note to be updated and update it 
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }
        
        // Varify that the Note is Updated by the same User or Not 
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

// ROUTE: 4 Delete an Exsisting Note using: DELETE "/api/note/deletenote". Login required  
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the Note to be deleted and delete it 
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }
        // Allow deletion only if user owns this Note 
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been Deleted", "Note": note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
})
module.exports = router;