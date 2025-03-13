const { ImageAnnotatorClient } = require('@google-cloud/vision');

// Initialize Google Cloud Vision client with credentials from environment
const credentials = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL
};

const client = new ImageAnnotatorClient({
  credentials: credentials
});

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { image } = JSON.parse(event.body);
    
    if (!image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No image data provided' })
      };
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
      return {
        statusCode: 200,
        body: JSON.stringify({ text: '' })
      };
    }

    // Process and clean up the recognized text
    const text = detections.text
      .replace(/\n/g, ' ')
      .trim();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ text })
    };
  } catch (error) {
    console.error('Error processing handwriting:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process handwriting' })
    };
  }
}; 