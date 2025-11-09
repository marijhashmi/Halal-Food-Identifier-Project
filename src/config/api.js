/**
 * API Configuration
 * 
 * Replace MODEL_API_URL with your trained model endpoint
 * This can be a Flask API hosted on Colab, Heroku, or any cloud service
 */

// TODO: Replace with your model API endpoint
export const MODEL_API_URL = 'https://your-model-api-url.com/predict';

/**
 * Send image to ML model for prediction
 * @param {string} imageUri - Local URI of the image to analyze
 * @returns {Promise<Object>} Prediction results with halal status, logos, ingredients, etc.
 */
export const predictProduct = async (imageUri) => {
  try {
    // Convert image to base64 or FormData
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'product.jpg',
    });

    const response = await fetch(MODEL_API_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling model API:', error);
    throw error;
  }
};

/**
 * Example response structure from your model API:
 * {
 *   halalStatus: 'halal' | 'haram' | 'mushbooh',
 *   halalLogoDetected: boolean,
 *   barcode: string | null,
 *   productName: string | null,
 *   ingredients: string[],
 *   eCodes: string[],
 *   confidence: number
 * }
 */

