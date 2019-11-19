const express = require('express');
const fetch = require('node-fetch');
const constants = require('../constants');
const Sentiment = require('sentiment');

const { Restaurant } = require('../models');

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise
});

const router = express.Router();

/*
 * GET Retrieves restaurants with no particular preferences. Providing the
 * query parameter `query` retrieves restaurants that match the query's
 * value.
 */
router.get('/', async(req, res, next) => {
  try {
    let query;
    if(req.query.pagetoken) {
      query = { pagetoken: req.query.pagetoken };
    } else {
      if(req.query.q) {
        query = {
          query: req.query.q
        };
      } else {
        query = { type: 'restaurant' };
      }
    }
    const response = await googleMapsClient.places(query).asPromise();
    const searchResult = await response.json;
    res.json(searchResult);
  } catch(error) {
    next(error);
  }
});

/**
 * GET Retrieves restaurants that are near by the user's current location.
 */
router.get('/nearby', async(req, res, next) => {
  try {
    let query;
    if(req.query.pagetoken) {
      query = { pagetoken: req.query.pagetoken };
    } else {
      let response = await fetch(constants.IP_API_URL);
      const { lat, lon } = await response.json();
      query = {
        rankby: 'distance',
        type: 'restaurant',
        location: [lat, lon]
      };
    }
    response = await googleMapsClient.placesNearby(query).asPromise();
    const searchResult = await response.json;
    res.json(searchResult);
  } catch(error) {
    next(error);
  }
});

/**
 * POST Creates a new Restaurant document in the database and sets its
 * rating to whichever the user specified.
 */
router.post('/thumb-rating', async(req, res, next) => {
  try {
    const { body, thumbRating } = req.body;
    let restaurant = await Restaurant.findOne({ 'body.id': body.id });
    if(restaurant === null) {
      restaurant = new Restaurant({ body, thumbRating });
      await restaurant.save();
    }
    res.json({ status: 'OK' });
  } catch(error) {
    next(error);
  }
});

/**
 * PUT Updates an existing Restaurant document in the database with a new
 * thumb rating.
 */
router.put('/:id/thumbs-up', async(req, res, next) => {
  try {
    const { thumbRating } = req.body;
    const filter = { id: req.params.id };
    const update = { thumbRating };
    let restaurant = await Restaurant.findOneAndUpdate(filter, update, {
      new: true
    });
    if(restaurant) {
      res.json(restaurant);
    }
  } catch(error) {
    next(error);
  }
});

/**
 * GET Retrieves all Restaurant documents from the database.
 */
router.get('/history', async(req, res, next) => {
  try {
    let restaurants = await Restaurant.find({});
    if(restaurants) {
      res.json(restaurants.map((res) => {
        let resJSON = res.toJSON();
        let restaurant = resJSON.body;
        restaurant['thumb_rating'] = resJSON.thumbRating;
        return restaurant;
      }));
    }
  } catch(error) {
    next(error);
  }
});

/**
 * GET Calculates the average user sentiment towards a particular restaurant.
 */
router.get('/sentiment', async(req, res, next) => {
  try {
    const { placeid } = req.query;
    const query = {
      placeid,
      fields: ['reviews']
    };
    const response = await googleMapsClient.place(query).asPromise();
    const json = await response.json;
    const totalSentiment = json.result.reviews
                               .map((review) => review.text)
                               .map((text) => new Sentiment().analyze(text).score)
                               .reduce((first, second) => first + second);
    const avgSentiment = totalSentiment / json.result.reviews.length;
    res.json({ avgSentiment });
  } catch(error) {
    next(error);
  }
});

module.exports = router;
