const express = require('express');
const router = express.Router();

const HotelService = require('../services/HotelService');
const db = require('../models');

const hotelService = new HotelService(db);

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

router.post('/', async function (req, res, next) {
  try {
    const { Name, Location } = req.body;

    await hotelService.createHotel(Name, Location);

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async function (req, res, next) {
  try {
    const { id } = req.body;

    await hotelService.deleteHotel(id);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

