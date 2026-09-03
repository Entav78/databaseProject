class UserService {
  constructor(db) {
    this.User = db.User;
    this.Room = db.Room;
    this.Hotel = db.Hotel;
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
}

module.exports = UserService;