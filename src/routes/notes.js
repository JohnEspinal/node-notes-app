const express = require('express');

const router = express.Router();

const Note = require('../models/Note');

const { isAuthenticated } = require('../helper/auth');


router.get('/notes/add', isAuthenticated, (req, res)=>{
    res.render('./notes/new-notes');
});

router.post('/notes/new-note', isAuthenticated, async (req, res)=>{
    const {title, description} = req.body;

    const errors = [];

    if(!title){
        errors.push({text: 'Please enter a title before submitting...'});
    }
    if(!description){
        errors.push({text: 'Please enter a description before submitting...'});
    }

    if(errors.length > 0){
        res.render('notes/new-notes',{
            errors,
            title,
            description
        });
    }else{
        const newNote = new Note(req.body);
        //console.log(newNote);
        newNote.user = req.user.id;
        await newNote.save();

        req.flash('success_msg', "Note Added Successfully");
        res.redirect('/notes')
    }
});

router.get('/notes', isAuthenticated, async (req, res)=>{
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'}).lean();
    
    res.render('notes/all-notes', {notes});
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res)=>{
    let currentId = req.params.id;

    const note = await Note.findById(currentId).lean();
    res.render('notes/edit-note', {
        note
    });
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res)=>{
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Note Updated Successfully');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res)=>{
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'Note Deleted Successfully');
    res.redirect('/notes');
});

module.exports = router;