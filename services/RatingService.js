const { QueryTypes } = require('sequelize');
const createError = require('http-errors');

class RatingService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Hotel = db.Hotel;
  }

  async createRating(userId, hotelId, value) {
    const ratingValue = Number(value);

    if (
      !Number.isInteger(ratingValue) ||
      ratingValue < 1 ||
      ratingValue > 5
    ) {
      throw createError(
        400,
        'The rating must be a whole number from 1 to 5.'
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

    const existingRatings = await this.sequelize.query(
        `SELECT 1
        FROM Rates
        WHERE UserId = :userId
          AND HotelId = :hotelId
        LIMIT 1`,
        {
          replacements: {
            userId,
            hotelId
          },
          type: QueryTypes.SELECT
        }
      );

      if (existingRatings.length > 0) {
        throw createError(
          409,
          'You have already rated this hotel.'
        );
    }

    return this.sequelize.query(
      `INSERT INTO Rates (UserId, HotelId, Value)
      VALUES (:userId, :hotelId, :ratingValue)`,
      {
        replacements: {
          userId,
          hotelId,
          ratingValue
        },
        type: QueryTypes.INSERT
      }
    );
  }
}

module.exports = RatingService;