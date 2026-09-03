const express = require('express');
const router = express.Router();

const db = require('../models');
const RoomService = require('../services/RoomService');
const ReservationService = require('../services/ReservationService');

const roomService = new RoomService(db);
const reservationService = new ReservationService(db);

const CURRENT_USER_ID = 1;

router.get('/:hotelId', async function (req, res, next) {
  try {
    const hotelId = Number(req.params.hotelId);
    const rooms = await roomService.getRoomsByHotel(hotelId);

    res.render('rooms', {
      title: 'Rooms',
      rooms,
      hotelId,
      reservationCreated: req.query.reserved === 'true'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:roomId/reservations', async function (req, res, next) {
  try {
    const roomId = Number(req.params.roomId);
    const hotelId = Number(req.body.hotelId);
    const { startDate, endDate } = req.body;

    await reservationService.createReservation(
      CURRENT_USER_ID,
      roomId,
      startDate,
      endDate
    );

    res.redirect(`/rooms/${hotelId}?reserved=true`);
  } catch (error) {
    next(error);
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { Capacity, PricePerDay, HotelId } = req.body;

    await roomService.createRoom(
      Number(Capacity),
      Number(PricePerDay),
      Number(HotelId)
    );

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async function (req, res, next) {
  try {
    const roomId = Number(req.body.id);

    await roomService.deleteRoom(roomId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;