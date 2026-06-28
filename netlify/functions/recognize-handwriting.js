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

    console.log('Processing image with OCR.space...');
    console.log('Image data length:', image.length);
    console.log('Image data preview:', image.substring(0, 50) + '...');

    // OCR.space API endpoint
    const apiUrl = 'https://api.ocr.space/parse/image';

    // Create form data for OCR.space
    const formData = new URLSearchParams();
    formData.append('apikey', process.env.OCR_SPACE_API_KEY || 'helloworld'); // 'helloworld' is the demo key
    formData.append('base64Image', `data:image/png;base64,${image}`);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('filetype', 'png');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true'); // Add scaling for better recognition
    formData.append('OCREngine', '2'); // Use engine 2 for better accuracy

    console.log('Sending request to OCR.space...');

    // Call OCR.space API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    console.log('OCR.space response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OCR.space API error:', errorText);
      throw new Error(`OCR.space API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    console.log('OCR.space full response:', JSON.stringify(result, null, 2));

    if (result.ParsedResults && result.ParsedResults.length > 0) {
      // Extract text from the first parsed result
      const text = result.ParsedResults[0].ParsedText
        .replace(/\n/g, ' ')
        .trim();

      console.log('Text recognized:', text);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ text })
      };
    } else {
      console.log('No text detected in image. OCR.space response:', result);

      // Check if there's an error message in the response
      if (result.ErrorMessage) {
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify({
            text: '',
            error: `OCR Error: ${result.ErrorMessage}`
          })
        };
      }

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          text: '',
          error: 'No text detected. Try writing more clearly or using larger letters.'
        })
      };
    }
  } catch (error) {
    console.error('Error processing handwriting:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to process handwriting';
    if (error.message.includes('API key')) {
      errorMessage = 'OCR.space API key is invalid or missing';
    } else if (error.message.includes('quota')) {
      errorMessage = 'OCR.space API quota exceeded (500 requests/day free)';
    } else if (error.message.includes('network')) {
      errorMessage = 'Network error connecting to OCR.space';
    } else if (error.message.includes('OCR.space API error')) {
      errorMessage = error.message;
    }

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: errorMessage })
    };
  }
}; 