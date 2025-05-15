const express = require('express');
const router = express.Router();
const {
  createPortfolio,
  updatePortfolio,
  getPortfolio,
  getAllPortfolios,
  deletePortfolio,
  getPublicPortfolio,
} = require('../controllers/portfolioController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Create portfolio
router.post(
  '/create',
  [auth, [check('title', 'Title is required').not().isEmpty()]],
  createPortfolio
);

// Update portfolio
router.put(
  '/update/:portfolioId',auth,
  updatePortfolio
);

// Get specific portfolio
router.get('/:portfolioId', auth, getPortfolio);

// Get all user's portfolios
router.get('/', auth, getAllPortfolios);
// Get public portfolio by fullname and title
router.get('/public/:fullname/:title', getPublicPortfolio);
// Delete portfolio
router.delete('/delete/:portfolioId', auth, deletePortfolio);

module.exports = router;