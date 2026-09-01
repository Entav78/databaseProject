module.exports = (sequelize, Sequelize) => {
  const Hotel = sequelize.define('Hotel', {
    Name: Sequelize.DataTypes.STRING,
    Location: Sequelize.DataTypes.STRING
  }, {
    timestamps: false
  });
  return Hotel
};