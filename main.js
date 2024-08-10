const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Entry = require('./model/model');
const path = require('path');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/data');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'assets')));

// Fetch data from the API and store in the database
app.get('/', async (req, res) => {
  try {
    // Fetch data from the API
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = response.data;

    // Extract values (cryptocurrency data) from the object
    const dataArray = Object.values(data);

    // Extract relevant fields and save to the database
    const top10Results = dataArray.slice(0, 11).map(result => ({
      name: result.name,
      last: result.last,
      buy: result.buy,
      sell: result.sell,
      volume: result.volume,
      base_unit: result.base_unit,
      // Calculate difference and savings
      difference: ((result.last - result.buy) / result.buy * 100).toFixed(2), // Percentage difference
      savings: ((result.last - result.buy) * result.volume).toFixed(2),
    }));
    await Entry.deleteMany({}); // Clear existing data

    await Entry.insertMany(top10Results);

    // Pass top10Results data to index.ejs template
    res.render('index', { top10Results });
  } catch (error) {
    console.error('Error fetching or storing data:', error);
    res.status(500).send('Internal server error.');
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
