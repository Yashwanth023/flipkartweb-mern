
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

// Upload a single image
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  const uploadedFilePath = `${req.protocol}://${req.get('host')}/${req.file.path.replace(/\\/g, '/')}`;
  res.status(200).json({ 
    message: 'File uploaded successfully',
    filePath: uploadedFilePath,
    fileName: req.file.filename
  });
});

module.exports = router;
