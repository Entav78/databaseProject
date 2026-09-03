const express = require('express');
const router = express.Router();

const db = require('../models');
const UserService = require('../services/UserService');

const userService = new UserService(db);

router.get('/:userId', async function (req, res, next) {
  try {
    const userId = Number(req.params.userId);

    const userRecord =
      await userService.getUserWithReservations(userId);

    if (!userRecord) {
      const error = new Error('User not found.');
      error.status = 404;
      return next(error);
    }

    const user = userRecord.get({
      plain: true
    });

    res.render('userDetails', {
      title: `${user.FirstName} ${user.LastName}`,
      user
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
