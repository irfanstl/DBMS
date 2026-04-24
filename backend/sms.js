import dotenv from 'dotenv';
dotenv.config();

/**
 * Sends an SMS via SMSIndiaHub API
 * 
 * @param {string} phoneNumber - The recipient's mobile number (e.g. "91989XXXXXXX")
 * @param {string} messageText - The text message to send
 * @returns {Promise<any>} The successful result from the API
 */
export const sendSms = async (phoneNumber, messageText) => {
  // Read credentials from your unified .env file
  const baseUrl = process.env.SMS_API_BASE_URL || 'http://cloud.smsindiahub.in/api/mt/SendSMS';
  const user = process.env.SMS_API_USER || 'demo';
  const password = process.env.SMS_API_PASSWORD || 'demo123';
  const senderId = process.env.SMS_API_SENDERID || 'WEBSMS';

  try {
    const url = new URL(baseUrl);
    url.searchParams.append('user', user);
    url.searchParams.append('password', password);
    url.searchParams.append('senderid', senderId);
    url.searchParams.append('channel', 'Promo');
    url.searchParams.append('DCS', '0');
    url.searchParams.append('flashsms', '0');
    url.searchParams.append('number', phoneNumber);
    url.searchParams.append('text', messageText);
    url.searchParams.append('route', '##'); // Adjust according to your SMS provider docs

    const response = await fetch(url.toString(), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.text(); 
    console.log("SMS Sent Successfully. API Result:", result);
    return result;

  } catch (error) {
    console.error("Failed to send SMS:", error.message);
    throw error;
  }
};
