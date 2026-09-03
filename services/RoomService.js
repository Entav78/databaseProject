const { QueryTypes } = require('sequelize');

class RoomService {
  constructor(db) {
    this.sequelize = db.sequelize;
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
    return this.sequelize.query(
      `DELETE FROM Rooms
       WHERE id = :roomId`,
      {
        replacements: {
          roomId
        },
        type: QueryTypes.DELETE
      }
    );
  }
}

module.exports = RoomService;