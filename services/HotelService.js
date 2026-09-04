const { QueryTypes } = require('sequelize');
const createError = require('http-errors');

class HotelService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Hotel = db.Hotel;
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

  async getHotelById(hotelId) {
  return this.Hotel.findByPk(hotelId, {
    attributes: [
      'id',
      'Name',
      'Location'
    ]
  });
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
  const normalizedName =
    typeof name === 'string' ? name.trim() : '';

  const normalizedLocation =
    typeof location === 'string' ? location.trim() : '';

  if (!normalizedName || !normalizedLocation) {
    throw createError(
      400,
      'Hotel name and location are required.'
    );
  }

  if (
    normalizedName.length > 255 ||
    normalizedLocation.length > 255
  ) {
    throw createError(
      400,
      'Hotel name and location must not exceed 255 characters.'
    );
  }

  return this.sequelize.query(
    `INSERT INTO Hotels (Name, Location)
     VALUES (:name, :location)`,
    {
      replacements: {
        name: normalizedName,
        location: normalizedLocation
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