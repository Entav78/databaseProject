const createError = require("http-errors");

function requireAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  if (req.method === "GET" || req.method === "HEAD") {
    return res.redirect("/login");
  }

  return next(createError(401, "Authentication is required."));
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return next(createError(401, "Authentication is required."));
  }

  if (req.user.Role !== "Admin") {
    return next(createError(403, "Administrator access is required."));
  }

  return next();
}

function requireSelfOrAdmin(req, res, next) {
  if (!req.user) {
    return next(createError(401, "Authentication is required."));
  }

  const requestedUserId = Number(req.params.userId);

  if (!Number.isInteger(requestedUserId) || requestedUserId < 1) {
    return next(createError(404, "User not found."));
  }

  const isOwnAccount = req.user.id === requestedUserId;
  const isAdmin = req.user.Role === "Admin";

  if (!isOwnAccount && !isAdmin) {
    return next(
      createError(403, "You cannot view another user's details.")
    );
  }

  return next();
}

module.exports = {
  requireAuthentication,
  requireAdmin,
  requireSelfOrAdmin,
};