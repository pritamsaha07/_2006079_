const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 8008;


async function fetchDataFromURL(url) {
    try {
      const response = await axios.get(url);
      return response.data.numbers;
    } catch (error) {
      console.error(`Error fetching data from ${url}: ${error.message}`);
      return [];
    }
  }
app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  if (!urls) {
    return res.status(400).json({ error: 'No URLs provided' });
  }

  const urlList = Array.isArray(urls) ? urls : [urls];
  const fetchDataPromises = urlList.map(fetchDataFromURL);

  try {
   
    const responseDataList = await Promise.all(fetchDataPromises);

  
    const mergedNumbers = [...new Set(responseDataList.flat())].sort((a, b) => a - b);

    res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error(`Error processing URLs: ${error.message}`);
    res.status(500).json({ error: 'Error processing URLs' });
  }
});


app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
