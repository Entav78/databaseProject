const bcrypt = require("bcryptjs");
const createError = require("http-errors");

const PASSWORD_HASH_ROUNDS = 12;

class AuthenticationService {
  constructor(db) {
    this.User = db.User;
  }

  async registerUser(firstName, lastName, username, password) {
    const requiredValues = [firstName, lastName, username, password];

    const hasInvalidValue = requiredValues.some(function (value) {
      return typeof value !== "string" || value.trim().length === 0;
    });

    if (hasInvalidValue) {
      throw createError(400, "All signup fields are required.");
    }

    if (password.length < 8) {
      throw createError(400, "The password must contain at least 8 characters.");
    }

    const normalizedUsername = username.trim().toLowerCase();

    const existingUser = await this.User.findOne({
      where: {
        Username: normalizedUsername,
      },
    });

    if (existingUser) {
      throw createError(409, "That username is already registered.");
    }

    const passwordHash = await bcrypt.hash(
      password,
      PASSWORD_HASH_ROUNDS
    );

    return this.User.create({
      FirstName: firstName.trim(),
      LastName: lastName.trim(),
      Username: normalizedUsername,
      PasswordHash: passwordHash,
      Role: "User",
    });
  }

  async authenticateUser(username, password) {
    if (typeof username !== "string" || typeof password !== "string") {
      return null;
    }

    const normalizedUsername = username.trim().toLowerCase();

    const user = await this.User.findOne({
      where: {
        Username: normalizedUsername,
      },
    });

    if (!user || !user.PasswordHash) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.PasswordHash
    );

    return passwordMatches ? user : null;
  }

  async getUserById(userId) {
    return this.User.findByPk(userId, {
      attributes: [
        "id",
        "FirstName",
        "LastName",
        "Username",
        "Role",
      ],
    });
  }
}

module.exports = AuthenticationService;