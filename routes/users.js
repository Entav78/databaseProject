const express = require('express');
const router = express.Router();

const db = require('../models');
const UserService = require('../services/UserService');

const {
  requireAuthentication,
  requireAdmin,
  requireSelfOrAdmin
} = require('../middleware/accessControl');

const userService = new UserService(db);

router.get(
  '/',
  requireAuthentication,
  requireAdmin,
  async function (req, res, next) {
    try {
      const userRecords = await userService.getAllUsers();

      const users = userRecords.map(function (userRecord) {
        return userRecord.get({
          plain: true
        });
      });

      res.render('users', {
        title: 'Users',
        users
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:userId',
  requireAuthentication,
  requireSelfOrAdmin,
  async function (req, res, next) {
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
  }
);

router.delete(
  '/:userId',
  requireAuthentication,
  requireAdmin,
  async function (req, res, next) {
    try {
      const userId = Number(req.params.userId);

      if (!Number.isInteger(userId) || userId < 1) {
        const error = new Error('User not found.');
        error.status = 404;
        return next(error);
      }

      const deletedRows = await userService.deleteUser(userId);

      if (deletedRows === 0) {
        const error = new Error(
          'The user does not exist or is protected from deletion.'
        );

        error.status = 409;
        return next(error);
      }

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
