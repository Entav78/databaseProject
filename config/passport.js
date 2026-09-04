const LocalStrategy = require("passport-local").Strategy;
const AuthenticationService = require("../services/AuthenticationService");

function configurePassport(passport, db) {
  const authenticationService = new AuthenticationService(db);

  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },

      async function (username, password, done) {
        try {
          const user = await authenticationService.authenticateUser(
            username,
            password
          );

          if (!user) {
            return done(null, false, {
              message: "Invalid username or password.",
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (userId, done) {
    try {
      const user = await authenticationService.getUserById(userId);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
}

module.exports = configurePassport;