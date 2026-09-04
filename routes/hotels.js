const express = require('express');
const router = express.Router();

const HotelService = require('../services/HotelService');
const RatingService = require('../services/RatingService');
const db = require('../models');

const {
  requireAuthentication,
  requireAdmin
} = require('../middleware/accessControl');

const hotelService = new HotelService(db);
const ratingService = new RatingService(db);

router.get('/', async function (req, res, next) {
  try {
    const hotels = await hotelService.getAllHotels();

    res.render('hotels', {
      title: 'Hotels',
      hotels
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:hotelId', async function (req, res, next) {
  try {
    const hotelId = Number(req.params.hotelId);
    const currentUserId = req.user?.id ?? null;

    const hotel = await hotelService.getHotelDetails(
      hotelId,
      currentUserId
    );

    if (!hotel) {
      const error = new Error('Hotel not found.');
      error.status = 404;
      return next(error);
    }

    res.render('hotelDetails', {
      title: hotel.Name,
      hotel,
      ratingCreated: req.query.rated === 'true'
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  requireAuthentication,
  requireAdmin,
  async function (req, res, next) {
    try {
      const { Name, Location } = req.body;

      await hotelService.createHotel(Name, Location);

      res.sendStatus(201);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/:hotelId/ratings',
  requireAuthentication,
  async function (req, res, next) {
    try {
      const hotelId = Number(req.params.hotelId);

      await ratingService.createRating(
        req.user.id,
        hotelId,
        req.body.value
      );

      res.redirect(`/hotels/${hotelId}?rated=true`);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/',
  requireAuthentication,
  requireAdmin,
  async function (req, res, next) {
    try {
      const { id } = req.body;

      await hotelService.deleteHotel(id);

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

