const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const emailService = require('../services/emailService');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Contact form endpoint
router.post('/contact', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('subject').trim().isLength({ min: 3 }).withMessage('Subject must be at least 3 characters'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    await emailService.sendContactEmail({ name, email, phone, subject, message });
    
    res.json({ 
      success: true, 
      message: 'Thank you for your message. We will get back to you soon!' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again later.' 
    });
  }
});

// Quote request endpoint
router.post('/quote', [
  body('companyName').trim().isLength({ min: 2 }).withMessage('Company name is required'),
  body('contactName').trim().isLength({ min: 2 }).withMessage('Contact name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('industry').trim().isLength({ min: 2 }).withMessage('Industry is required'),
  body('productInterest').trim().isLength({ min: 2 }).withMessage('Product interest is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive number'),
  body('requirements').trim().isLength({ min: 10 }).withMessage('Requirements must be at least 10 characters'),
  handleValidationErrors
], async (req, res) => {
  try {
    const quoteData = req.body;
    await emailService.sendQuoteEmail(quoteData);
    
    res.json({ 
      success: true, 
      message: 'Thank you for your quote request. We will contact you shortly!' 
    });
  } catch (error) {
    console.error('Quote form error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process quote request. Please try again later.' 
    });
  }
});

// Registration form endpoint
router.post('/register', [
  body('companyName').trim().isLength({ min: 2 }).withMessage('Company name is required'),
  body('contactName').trim().isLength({ min: 2 }).withMessage('Contact name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('address').trim().isLength({ min: 5 }).withMessage('Address is required'),
  body('city').trim().isLength({ min: 2 }).withMessage('City is required'),
  body('state').trim().isLength({ min: 2 }).withMessage('State is required'),
  body('zipCode').isPostalCode('any').withMessage('Please provide a valid ZIP code'),
  body('businessType').trim().isLength({ min: 2 }).withMessage('Business type is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const registrationData = req.body;
    await emailService.sendRegistrationEmail(registrationData);
    
    res.json({ 
      success: true, 
      message: 'Registration successful! We will contact you soon.' 
    });
  } catch (error) {
    console.error('Registration form error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process registration. Please try again later.' 
    });
  }
});

module.exports = router;
