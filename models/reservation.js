module.exports = (sequelize, Sequelize) => {
  const Reservation = sequelize.define('Reservation', {
    StartDate: Sequelize.DataTypes.DATE,
    EndDate: Sequelize.DataTypes.DATE
  }, {
    timestamps: false,
    validate: {
      datesProvidedTogether() {
        const hasStartDate = this.StartDate != null;
        const hasEndDate = this.EndDate != null;

        if (!hasStartDate && !hasEndDate) {
          return;
        }

        if (hasStartDate !== hasEndDate) {
          throw new Error('Start date and end date must be provided together.');
        }

        const startDate = new Date(this.StartDate);
        const endDate = new Date(this.EndDate);

        if (
          Number.isNaN(startDate.getTime()) ||
          Number.isNaN(endDate.getTime())
        ) {
          throw new Error('The reservation dates are invalid.');
        }

        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
        const duration = endDate.getTime() - startDate.getTime();

        if (duration < oneDayInMilliseconds) {
          throw new Error('The end date must be at least one day after the start date.');
        }

        const now = new Date();

        if (startDate <= now || endDate <= now) {
          throw new Error('Both reservation dates must be in the future.');
        }
      }
    }
  });
  return Reservation
};
