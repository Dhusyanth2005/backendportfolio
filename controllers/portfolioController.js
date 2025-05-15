const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const createPortfolio = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    profession,
    bio,
    skills,
    achievements,
    experiences,
    projects,
    education,
    socialLinks,
    selectedTemplate,
    selectedTheme,
    isPublished,
    fullName,
    email,
    phone,
    location,
  } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const portfolio = new Portfolio({
      user: req.user.id,
      title,
      profession,
      bio,
      skills,
      achievements,
      experiences,
      projects,
      education,
      socialLinks,
      selectedTemplate,
      selectedTheme,
      isPublished,
      fullName: fullName || user.fullName,
      profileImage: user.profileImage || '/assets/images/default-profile.png',
      email: email || user.email,
      phone: phone || user.phone,
      location: location || user.location,
    });

    await portfolio.save();

    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { portfolios: portfolio._id } },
      { new: true }
    );

    res.json(portfolio);
  } catch (err) {
    console.error('Error creating portfolio:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updatePortfolio = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    profession,
    bio,
    skills,
    achievements,
    experiences,
    projects,
    education,
    socialLinks,
    selectedTemplate,
    selectedTheme,
    isPublished,
    fullName,
    email,
    phone,
    location,
  } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const portfolio = await Portfolio.findById(req.params.portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    if (portfolio.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      req.params.portfolioId,
      {
        $set: {
          title,
          profession,
          bio,
          skills,
          achievements,
          experiences,
          projects,
          education,
          socialLinks,
          selectedTemplate,
          selectedTheme,
          isPublished,
          fullName: fullName || user.fullName,
          profileImage: user.profileImage || '/assets/images/default-profile.png',
          email: email || user.email,
          phone: phone || user.phone,
          location: location || user.location,
        },
      },
      { new: true }
    );

    res.json(updatedPortfolio);
  } catch (err) {
    console.error('Error updating portfolio:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    if (portfolio.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(portfolio);
  } catch (err) {
    console.error('Error fetching portfolio:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user.id });
    res.json(portfolios);
  } catch (err) {
    console.error('Error fetching portfolios:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    if (portfolio.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Portfolio.findByIdAndDelete(req.params.portfolioId);

    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { portfolios: req.params.portfolioId } },
      { new: true }
    );

    res.json({ message: 'Portfolio deleted' });
  } catch (err) {
    console.error('Error deleting portfolio:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getPublicPortfolio = async (req, res) => {
  try {
    const { fullname, title } = req.params;

    const normalizedFullName = fullname.replace(/-/g, ' ').toLowerCase();
    const normalizedTitle = title.replace(/-/g, ' ').toLowerCase();

    const user = await User.findOne({
      fullName: { $regex: new RegExp(`^${normalizedFullName}$`, 'i') },
    }).select('fullName profileImage email phone location');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const portfolio = await Portfolio.findOne({
      user: user._id,
      title: { $regex: new RegExp(`^${normalizedTitle}$`, 'i') },
      isPublished: true,
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found or not published' });
    }

    const portfolioData = {
      ...portfolio.toObject(),
      fullName: user.fullName,
      profileImage: user.profileImage || '/assets/images/default-profile.png',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
    };

    res.json(portfolioData);
  } catch (err) {
    console.error('Error fetching public portfolio:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createPortfolio, updatePortfolio, getPortfolio, getAllPortfolios, deletePortfolio, getPublicPortfolio };