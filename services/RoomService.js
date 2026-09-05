const { QueryTypes } = require('sequelize');
const createError = require('http-errors');

class RoomService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Room = db.Room;
    this.Hotel = db.Hotel;
  }

  async getRoomsByHotel(hotelId) {
    return this.sequelize.query(
      `SELECT id, Capacity, PricePerDay, HotelId
       FROM Rooms
       WHERE HotelId = :hotelId
       ORDER BY PricePerDay`,
      {
        replacements: {
          hotelId
        },
        type: QueryTypes.SELECT
      }
    );
  }

  async createRoom(capacity, pricePerDay, hotelId) {
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw createError(
      400,
      'Room capacity must be a positive integer.'
    );
  }

  if (!Number.isFinite(pricePerDay) || pricePerDay <= 0) {
    throw createError(
      400,
      'Room price must be a positive number.'
    );
  }

  if (!Number.isInteger(hotelId) || hotelId < 1) {
    throw createError(
      400,
      'A valid hotel ID is required.'
    );
  }

  const hotel = await this.Hotel.findByPk(hotelId, {
    attributes: [
      'id'
    ]
  });

  if (!hotel) {
    throw createError(
      404,
      'Hotel not found.'
    );
  }

  return this.sequelize.query(
    `INSERT INTO Rooms (Capacity, PricePerDay, HotelId)
     VALUES (:capacity, :pricePerDay, :hotelId)`,
    {
      replacements: {
        capacity,
        pricePerDay,
        hotelId
      },
      type: QueryTypes.INSERT
    }
  );
}

  async deleteRoom(roomId) {
  if (!Number.isInteger(roomId) || roomId < 1) {
    throw createError(
      400,
      'A valid room ID is required.'
    );
  }

  const deletedRows = await this.Room.destroy({
    where: {
      id: roomId
    }
  });

  if (deletedRows === 0) {
    throw createError(
      404,
      'Room not found.'
    );
  }

  return deletedRows;
}
}

module.exports = RoomService;