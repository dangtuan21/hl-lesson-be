const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const RepoUserSchema = new Schema({
  repoid: {
    type: String
  },
  userEmail: {
    type: String
  },
  
});

module.exports = RepoUser = mongoose.model('repoUser', RepoUserSchema);

