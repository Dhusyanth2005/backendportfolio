const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  profession: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  achievements: [{
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    year: { type: String, default: '' }
  }],
  experiences: [{
    title: { type: String, default: '' },
    company: { type: String, default: '' },
    period: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  projects: [{
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    link: { type: String, default: '' }
  }],
  education: [{
    degree: { type: String, default: '' },
    institution: { type: String, default: '' },
    year: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  socialLinks: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  selectedTemplate: {
    type: String,
    default: 1
  },
  selectedTheme: {
    type: String,
    default: 'dark'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);