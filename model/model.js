const mongoose = require('mongoose');

// Create a schema for the data
const entrySchema = new mongoose.Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});

// Create a model based on the schema
const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
