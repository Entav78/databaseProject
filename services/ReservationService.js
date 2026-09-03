const { QueryTypes } = require('sequelize');

class ReservationService {
  constructor(db) {
    this.sequelize = db.sequelize;
  }

  async createReservation(userId, roomId, startDate, endDate) {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(parsedEndDate.getTime())
    ) {
      throw new Error('The reservation dates are invalid.');
    }

    if (parsedStartDate >= parsedEndDate) {
      throw new Error('The end date must be later than the start date.');
    }

    return this.sequelize.query(
      `INSERT INTO Reservations
         (UserId, RoomId, StartDate, EndDate)
       VALUES
         (:userId, :roomId, :startDate, :endDate)`,
      {
        replacements: {
          userId,
          roomId,
          startDate: parsedStartDate,
          endDate: parsedEndDate
        },
        type: QueryTypes.INSERT
      }
    );
  }
}

module.exports = ReservationService;