const express = require('express');
const router = express.Router();
const sendContactEmail = require('../utils/sendContactEmail');

router.post('/contact-email', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    await sendContactEmail(name, email, subject, message);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Error sending contact email:', err.message);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

module.exports = router;
