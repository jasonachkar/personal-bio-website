const express = require('express');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const cors = require('cors');
require('dotenv').config();

const router = express.Router();
router.use(cors());
router.use(express.json());

// Initialize Google Cloud Vision client
const client = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

router.post('/api/recognize-handwriting', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(image, 'base64');

    // Perform text detection
    const [result] = await client.documentTextDetection({
      image: {
        content: imageBuffer
      }
    });

    const detections = result.fullTextAnnotation;

    if (!detections) {
      return res.json({ text: '' });
    }

    // Process and clean up the recognized text
    const text = detections.text
      .replace(/\n/g, ' ')
      .trim();

    return res.json({ text });
  } catch (error) {
    console.error('Error processing handwriting:', error);
    return res.status(500).json({ error: 'Failed to process handwriting' });
  }
});

module.exports = router; 