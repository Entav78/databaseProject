module.exports = (sequelize, Sequelize) => {
  const Room = sequelize.define('Room', {
    PricePerDay: Sequelize.DataTypes.DECIMAL(10, 2),
    Capacity: Sequelize.DataTypes.INTEGER
  }, {
    timestamps: false
  });
  return Room
};