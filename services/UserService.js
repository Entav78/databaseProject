const { Op } = require('sequelize');
class UserService {
  constructor(db) {
    this.User = db.User;
    this.Room = db.Room;
    this.Hotel = db.Hotel;
  }

  async getAllUsers() {
  return this.User.findAll({
    attributes: [
      'id',
      'FirstName',
      'LastName',
      'Username',
      'Role'
    ],
    order: [
      ['id', 'ASC']
    ]
  });
}

  async getUserWithReservations(userId) {
    return this.User.findByPk(userId, {
      attributes: [
        'id',
        'FirstName',
        'LastName'
      ],

      include: [
        {
          model: this.Room,

          attributes: [
            'id',
            'Capacity',
            'PricePerDay'
          ],

          through: {
            attributes: [
              'StartDate',
              'EndDate'
            ]
          },

          include: [
            {
              model: this.Hotel,

              attributes: [
                'id',
                'Name',
                'Location'
              ]
            }
          ]
        }
      ]
    });
  }

  async deleteUser(userId) {
  return this.User.destroy({
    where: {
      id: userId,

      Role: {
        [Op.ne]: 'Admin'
      }
    }
  });
}
}

module.exports = UserService;