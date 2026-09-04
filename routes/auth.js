const express = require("express");
const passport = require("passport");

const db = require("../models");
const AuthenticationService = require("../services/AuthenticationService");

const router = express.Router();
const authenticationService = new AuthenticationService(db);

router.get("/login", function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/hotels");
  }

  const error = req.query.error === "1"
    ? "Invalid username or password."
    : null;

  const success = req.query.registered === "1"
    ? "Your account was created. You can now log in."
    : null;

  res.render("login", {
    error,
    success,
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/hotels",
    failureRedirect: "/login?error=1",
  })
);

router.get("/signup", function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/hotels");
  }

  res.render("signup", {
    error: null,
    values: {
      firstName: "",
      lastName: "",
      username: "",
    },
  });
});

router.post("/signup", async function (req, res, next) {
  const {
    firstName,
    lastName,
    username,
    password,
    confirmPassword,
  } = req.body;

  const values = {
    firstName: firstName || "",
    lastName: lastName || "",
    username: username || "",
  };

  if (
    typeof confirmPassword !== "string" ||
    password !== confirmPassword
  ) {
    return res.status(400).render("signup", {
      error: "The passwords do not match.",
      values,
    });
  }

  try {
    await authenticationService.registerUser(
      firstName,
      lastName,
      username,
      password
    );

    res.redirect("/login?registered=1");
  } catch (error) {
    if (error.status === 400 || error.status === 409) {
      return res.status(error.status).render("signup", {
        error: error.message,
        values,
      });
    }

    next(error);
  }
});

router.post("/logout", function (req, res, next) {
  req.logout(function (logoutError) {
    if (logoutError) {
      return next(logoutError);
    }

    req.session.destroy(function (sessionError) {
      if (sessionError) {
        return next(sessionError);
      }

      res.clearCookie("hotel.sid");
      res.redirect("/login");
    });
  });
});

module.exports = router;