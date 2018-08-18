const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
const util = require("../common/util.js");

// Course model
const Course = require('../models/Course');

// Load Validation
const validateCourseInput = require('../validation/course');

// @route   GET course/test
// @desc    Tests Course route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ msg: 'Course Works' });
});

// @route   GET course/search/:searchTerm/:userEmail
// @desc    Search course
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
      Course.find(filter)
        .sort({ 'createdDate': -1 })
        .limit(PAGE_LIMIT)
        .then(courses => {
          console.log('courses ', courses);
          if (!courses) {
            errors = {
              code: 404,
              message: 'There are no courses',
            }
            console.log(errors.message);
            return res.status(404).json(errors);
          }
          res.json(courses);
        })
        .catch(err => {
          errors = {
            code: 404,
            message: 'There are no courses',
          }
          res.status(404).json(errors);
        }
        );
    });
  });

// @route   GET course/:id/:userEmail
// @desc    Get course by id and userEmail
// @access  Public
router.get('/:id/:userEmail', (req, res) => {
  const id = req.params.id;
  const userEmail = req.params.userEmail;
  console.log('Get Task with userEmail ', userEmail);
  util.connectDatabaseByUserEmail(userEmail, () => {
    Course.findById(id)
      .then(course => {
        res.json(course);
      })
      .catch(err => {
        errors = {
          code: 404,
          message: 'There are no courses',
        }
        res.status(404).json(errors);
      }
      );
  });
});

// @route   POST course
// @desc    Add course 
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.body._id;
    const userEmail = req.body.userEmail;
    util.connectDatabaseByUserEmail(userEmail, () => {

      const { errors, isValid } = validateCourseInput(req.body);
      // Check Validation
      if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
      }

      if (id === undefined) {
        //create new course
        const newCourse = new Course({
          description: req.body.description,
          code: req.body.code,
          name: req.body.name,
          learningMethod: req.body.learningMethod,
          createdDate: req.body.createdDate,
        });
        newCourse.save()
          .then(course => res.json(course))
          .catch(err => res.status(404).json({ coursenotfound: 'Can not create' }));
      }
      else {
        //update course
        const courseFields = {};
        if (req.body.description)
          courseFields.description = req.body.description;
        if (req.body.code)
          courseFields.code = req.body.code;
        if (req.body.name)
          courseFields.name = req.body.name;
        if (req.body.learningMethod)
          courseFields.learningMethod = req.body.learningMethod;
        if (req.body.createdDate)
          courseFields.createdDate = req.body.createdDate;

        Course.findOneAndUpdate(
          { _id: id },
          { $set: courseFields },
          { new: true }
        ).then(course => res.json(course));
      }
    });
  }
);

// @route   DELETE api/course/:id
// @desc    Delete course
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
      Course.findOne(filter)
        .then(course => {
          // Delete
          console.log('found ', course);
          course.remove().then(() => res.json({ success: true }));
        })
        .catch(err => {
          errors = {
            code: 404,
            message: 'There are no courses',
          }
          res.status(404).json(errors);
        }
        );
    });
  });

module.exports = router;