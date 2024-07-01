const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const { URL } = require('url');

const app = express();
const PORT = 5000;

// Enable CORS and body parsing
app.use(cors());
app.use(express.json());

// Define a route to scrape data based on the provided URL
app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const { data } = await axios.get(url);
    const baseUrl = new URL(url);
    const $ = cheerio.load(data);

    // Scrape all <a> tags
    const links = [];
    $('a').each((index, element) => {
      const href = $(element).attr('href');
      const fullUrl = href ? new URL(href, baseUrl).href : null;
      links.push({
        text: $(element).text(),
        href: fullUrl
      });
    });

    res.json({ links });
  } catch (error) {
    res.status(500).json({ error: 'Error scraping the website' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
