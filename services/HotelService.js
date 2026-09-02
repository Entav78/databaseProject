const { QueryTypes } = require('sequelize');

class HotelService {
  constructor(db) {
    this.sequelize = db.sequelize;
  }

  async createHotel(name, location) {
    return this.sequelize.query(
      `INSERT INTO Hotels (Name, Location)
       VALUES (:name, :location)`,
      {
        replacements: {
          name,
          location
        },
        type: QueryTypes.INSERT
      }
    );
  }

  async getAllHotels() {
    return this.sequelize.query(
      'SELECT * FROM Hotels',
      {
        type: QueryTypes.SELECT
      }
    );
  }

  async deleteHotel(hotelId) {
    return this.sequelize.query(
      'DELETE FROM Hotels WHERE id = :hotelId',
      {
        replacements: {
          hotelId
        },
        type: QueryTypes.DELETE
      }
    );
  }
}

module.exports = HotelService;