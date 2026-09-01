const Sequelize = require('sequelize');

const connectionSettings = {
  dialect: process.env.DIALECT,
  database: process.env.DATABASE_NAME,
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  host: process.env.HOST
};

const sequelize = new Sequelize(connectionSettings);

const User = require('./user')(sequelize, Sequelize);
const Hotel = require('./hotel')(sequelize, Sequelize);
const Room = require('./room')(sequelize, Sequelize);
const Reservation = require('./reservation')(sequelize, Sequelize);
const Rate = require('./rate')(sequelize, Sequelize);

// One hotel has many rooms
Hotel.hasMany(Room);
Room.belongsTo(Hotel);

// Users rate hotels through the Rate model
User.belongsToMany(Hotel, { through: Rate });
Hotel.belongsToMany(User, { through: Rate });

// Users reserve rooms through the Reservation model
User.belongsToMany(Room, { through: Reservation });
Room.belongsToMany(User, { through: Reservation });

const db = {
  sequelize,
  User,
  Hotel,
  Room,
  Reservation,
  Rate
};

module.exports = db;