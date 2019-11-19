const mongoose = require('mongoose');

let restaurantSchema = new mongoose.Schema({
  body: mongoose.Schema.Types.Mixed,
  thumbRating: String
});

let Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
