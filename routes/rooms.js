const express = require('express');
const router = express.Router();

const db = require('../models');
const RoomService = require('../services/RoomService');
const ReservationService = require('../services/ReservationService');
const HotelService = require('../services/HotelService');

const {
  requireAuthentication,
  requireAdmin
} = require('../middleware/accessControl');

const roomService = new RoomService(db);
const reservationService = new ReservationService(db);
const hotelService = new HotelService(db);


router.get('/:hotelId', async function (req, res, next) {
  try {
    const hotelId = Number(req.params.hotelId);

    if (!Number.isInteger(hotelId) || hotelId < 1) {
      const error = new Error('Hotel not found.');
      error.status = 404;
      return next(error);
    }

    const hotel = await hotelService.getHotelById(hotelId);

    if (!hotel) {
      const error = new Error('Hotel not found.');
      error.status = 404;
      return next(error);
    }

    const rooms = await roomService.getRoomsByHotel(hotelId);

    res.render('rooms', {
      title: 'Rooms',
      rooms,
      hotelId,
      reservationCreated:
        Boolean(req.user) &&
        req.query.reserved === 'true'
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/:roomId/reservations',
  requireAuthentication,
  async function (req, res, next) {
    try {
      const roomId = Number(req.params.roomId);
      const hotelId = Number(req.body.hotelId);
      const { startDate, endDate } = req.body;

      await reservationService.createReservation(
        req.user.id,
        roomId,
        startDate,
        endDate
      );

      res.redirect(`/rooms/${hotelId}?reserved=true`);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  requireAuthentication,
  requireAdmin,
  async function (req, res, next) {
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
  }
);

router.delete(
  '/',
  requireAuthentication,
  requireAdmin,
  async function (req, res, next) {
    try {
      const roomId = Number(req.body.id);

      await roomService.deleteRoom(roomId);

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;