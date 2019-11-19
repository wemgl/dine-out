const express = require('express');
const router = express.Router();

const GOOGLE_MAPS_PHOTOS_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/photo';

/*
 * GET Returns the URL for an image given its photo reference.
 */
router.get('/', async(req, res, next) => {
  try {
    const { photoreference, maxwidth } = req.query;
    const photoUrl = `${GOOGLE_MAPS_PHOTOS_ENDPOINT}?key=${process.env.GOOGLE_MAPS_API_KEY}&photoreference=${photoreference}&maxwidth=${maxwidth}`;
    res.json({ photoUrl });
  } catch(error) {
    next(error);
  }
});

module.exports = router;
