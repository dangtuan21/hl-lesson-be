const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const LessonSchema = new Schema({
  name: {
    type: String
  },
  code: {
    type: String
  },
  description: {
    type: String
  },
  authorId: {
    type: String
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  price: {
    type: Number
  },
  poster: {
    type: String
  },
  level: {
    type: String
  },
  duration: {
    type: String
  },
  categoryId: {
    type: String
  },
  createdDate: {
    type: Date
  },

  sections: [
    {
      _id: String,
      name: {
        type: String
      },
      description: {
        type: String
      },
      sequence: {
        type: Number
      },
      units: [
        {
          _id: String,
          name: {
            type: String
          },
          description: {
            type: String
          },
          unitType: { //1=Document, 2=Test
            type: Number
          },
          sequence: {
            type: Number
          },
        }
      ],  
          
    }
  ],  
  
});

module.exports = Lesson = mongoose.model('lesson', LessonSchema);
