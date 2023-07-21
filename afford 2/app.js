
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.get('/numbers', async (req, res) => {
  try {
    const urls = req.query.url;

    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'Invalid URL list provided.' });
    }

    const urlRequests = urls.map(async (url) => {
      try {
        const response = await axios.get(url, { timeout: 3000 });
        return response.data.numbers;
      } catch (error) {
        console.error(`Error fetching data from ${url}: ${error.message}`);
        return [];
      }
    });

    const responses = await Promise.all(urlRequests);
    const mergedNumbers = [...new Set(responses.flat())].sort((a, b) => a - b);

    res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Number Management Service is running on port ${PORT}`);
});
