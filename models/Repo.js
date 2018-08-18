const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const RepoSchema = new Schema({
  repoCode: {
    type: String
  },
  repoConnectionUrl: {
    type: String
  },
  companyName: {
    type: String
  },
  contactName: {
    type: String
  },
  contactEmail: {
    type: String
  },
  description: {
    type: String
  },
  adminName: {
    type: String
  },
  adminEmail: {
    type: String
  },
  adminPassword: {
    type: String
  },
  createdDate: {
    type: Date
  },  
});

module.exports = Repo = mongoose.model('repo', RepoSchema);

