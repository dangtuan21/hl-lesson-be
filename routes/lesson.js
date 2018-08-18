const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
const util = require("../common/util.js");

// Lesson model
const Lesson = require('../models/Lesson');

// Load Validation
const validateLessonInput = require('../validation/lesson');

// @route   GET lesson/test
// @desc    Tests Lesson route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ msg: 'Lesson Works' });
});

// @route   GET lesson/search/:searchTerm/:userEmail
// @desc    Search lesson
// @access  Public
router.get('/search/:searchTerm/:userEmail',
  (req, res) => {
    const searchTerm = req.params.searchTerm;
    const userEmail = req.params.userEmail;

    const errors = {};
    const PAGE_LIMIT = require('../config/constants').PAGE_LIMIT;
    util.connectDatabaseByUserEmail(userEmail, (err) => {
      if (err) {
        console.log('Err connectDatabaseByUserEmail ', err);
        return res.status(404).json(err);
      }
      console.log('connectDatabaseByUserEmail: Connected to DB with userEmail ', userEmail);

      var filter = {};

      if (searchTerm != '*') {
        filter = {
          $or: [
            { name: { "$regex": searchTerm, "$options": "i" } },
            { code: { "$regex": searchTerm, "$options": "i" } },
          ]
        };
      }

      console.log('filter ', filter);
      Lesson.find(filter)
        .sort({ 'createdDate': -1 })
        .limit(PAGE_LIMIT)
        .then(lessons => {
          console.log('lessons ', lessons);
          if (!lessons) {
            errors = {
              code: 404,
              message: 'There are no lessons',
            }
            console.log(errors.message);
            return res.status(404).json(errors);
          }
          res.json(lessons);
        })
        .catch(err => {
          errors = {
            code: 404,
            message: 'There are no lessons',
          }
          res.status(404).json(errors);
        }
        );
    });
  });

// @route   GET lesson/:id/:userEmail
// @desc    Get lesson by id and userEmail
// @access  Public
router.get('/:id/:userEmail', (req, res) => {
  const id = req.params.id;
  const userEmail = req.params.userEmail;
  console.log('Get Task with userEmail ', userEmail);
  util.connectDatabaseByUserEmail(userEmail, () => {
    Lesson.findById(id)
      .then(lesson => {
        res.json(lesson);
      })
      .catch(err => {
        errors = {
          code: 404,
          message: 'There are no lessons',
        }
        res.status(404).json(errors);
      }
      );
  });
});

// @route   POST lesson
// @desc    Add lesson 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;
    const userEmail = req.body.userEmail;
    util.connectDatabaseByUserEmail(userEmail, () => {

      const { errors, isValid } = validateLessonInput(req.body);
      // Check Validation
      if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
      }

      if (id === undefined) {
        //create new lesson
        const newLesson = new Lesson({
          description: req.body.description,
          code: req.body.code,
          name: req.body.name,
          learningMethod: req.body.learningMethod,
          createdDate: req.body.createdDate,
        });
        newLesson.save()
          .then(lesson => res.json(lesson))
          .catch(err => res.status(404).json({ lessonnotfound: 'Can not create' }));
      }
      else {
        //update lesson
        const lessonFields = {};
        if (req.body.description)
          lessonFields.description = req.body.description;
        if (req.body.code)
          lessonFields.code = req.body.code;
        if (req.body.name)
          lessonFields.name = req.body.name;
        if (req.body.learningMethod)
          lessonFields.learningMethod = req.body.learningMethod;
        if (req.body.createdDate)
          lessonFields.createdDate = req.body.createdDate;

        Lesson.findOneAndUpdate(
          { _id: id },
          { $set: lessonFields },
          { new: true }
        ).then(lesson => res.json(lesson));
      }
    });
  }
);

// @route   DELETE api/lesson/:id
// @desc    Delete lesson
// @access  Private
router.delete(
  '/:id/:userEmail',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.params.id;
    const userEmail = req.params.userEmail;
    console.log('delete with id + userEmail ', id, userEmail);

    util.connectDatabaseByUserEmail(userEmail, () => {
      var filter = {
        _id: id,
      };

      console.log('delete with filter ', filter);
      Lesson.findOne(filter)
        .then(lesson => {
          // Delete
          console.log('found ', lesson);
          lesson.remove().then(() => res.json({ success: true }));
        })
        .catch(err => {
          errors = {
            code: 404,
            message: 'There are no lessons',
          }
          res.status(404).json(errors);
        }
        );
    });
  });

module.exports = router;