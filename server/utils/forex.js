const axios = require('axios');

/**
 * Fetches exchange rates from a Forex API
 * @param {string} from - Source currency (e.g., 'PKR')
 * @param {string} to - Target currency (e.g., 'USD')
 * @returns {number} - The exchange rate
 */
const getExchangeRate = async (from, to) => {
  try {
    // If using ExchangeRate-API (Free Tier example)
    const apiKey = process.env.EXCHANGERATE_API_KEY;
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`;
    
    // For now, let's use a fallback/mock if no API key is provided
    if (!apiKey || apiKey === 'your_api_key_placeholder') {
      const mockRates = {
        'PKR_USD': 0.0036,
        'USD_PKR': 278.50,
        'PKR_EUR': 0.0033,
        'EUR_PKR': 301.20,
      };
      return mockRates[`${from}_${to}`] || 1;
    }

    const response = await axios.get(url);
    if (response.data && response.data.conversion_rate) {
      return response.data.conversion_rate;
    }
    
    throw new Error('Could not fetch exchange rate');
  } catch (error) {
    console.error('Forex API Error:', error.message);
    throw error;
  }
};

module.exports = { getExchangeRate };
