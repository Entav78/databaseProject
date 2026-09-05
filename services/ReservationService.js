const { QueryTypes } = require('sequelize');
const createError = require('http-errors');

class ReservationService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Room = db.Room;
  }

  async createReservation(userId, roomId, startDate, endDate) {

    if (!Number.isInteger(roomId) || roomId < 1) {
      throw createError(
        400,
        'A valid room ID is required.'
      );
    }
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(parsedEndDate.getTime())
    ) throw createError(
        400,
        'The reservation dates are invalid.'
      );

    if (parsedStartDate >= parsedEndDate) {
      throw createError(
        400,
        'The end date must be later than the start date.'
      );
    }

    const room = await this.Room.findByPk(roomId, {
        attributes: [
          'id',
          'HotelId'
        ]
      });

      if (!room) {
        throw createError(
          404,
          'Room not found.'
        );
      }

    try {
        await this.sequelize.query(
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
      } catch (error) {
        const isDuplicateReservation =
          error.name === 'SequelizeUniqueConstraintError' ||
          error.original?.code === 'ER_DUP_ENTRY';

        if (isDuplicateReservation) {
          throw createError(
            409,
            'You already have a reservation for this room.'
          );
        }

        throw error;
      }

      return room.HotelId;
  }
}

module.exports = ReservationService;