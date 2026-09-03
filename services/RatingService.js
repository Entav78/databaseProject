const { QueryTypes } = require('sequelize');

class RatingService {
  constructor(db) {
    this.sequelize = db.sequelize;
  }

  async createRating(userId, hotelId, value) {
    const ratingValue = Number(value);

    if (
  !Number.isInteger(ratingValue) ||
  ratingValue < 1 ||
  ratingValue > 5
) {
  const error = new Error(
    'The rating must be a whole number from 1 to 5.'
  );

  error.status = 400;
  throw error;
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