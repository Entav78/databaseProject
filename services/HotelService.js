const { QueryTypes } = require('sequelize');

class HotelService {
  constructor(db) {
    this.sequelize = db.sequelize;
  }

  async getAllHotels() {
    return this.sequelize.query(
      `SELECT id, Name, Location
       FROM Hotels
       ORDER BY Name`,
      {
        type: QueryTypes.SELECT
      }
    );
  }

  async getHotelDetails(hotelId, userId) {
    const hotels = await this.sequelize.query(
      `SELECT
         hotel.id,
         hotel.Name,
         hotel.Location,
         ROUND(AVG(rating.Value), 1) AS AvgRate,
         EXISTS (
           SELECT 1
           FROM Rates AS currentUserRating
           WHERE currentUserRating.HotelId = hotel.id
             AND currentUserRating.UserId = :userId
         ) AS HasRated
       FROM Hotels AS hotel
       LEFT JOIN Rates AS rating
         ON rating.HotelId = hotel.id
       WHERE hotel.id = :hotelId
       GROUP BY hotel.id, hotel.Name, hotel.Location`,
      {
        replacements: {
          hotelId,
          userId
        },
        type: QueryTypes.SELECT
      }
    );

    const hotel = hotels[0];

    if (!hotel) {
      return null;
    }

    hotel.HasRated = Boolean(hotel.HasRated);

    return hotel;
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

  async deleteHotel(hotelId) {
    return this.sequelize.query(
      `DELETE FROM Hotels
       WHERE id = :hotelId`,
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