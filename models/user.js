module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      FirstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      LastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      Username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      PasswordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      Role: {
        type: DataTypes.ENUM("User", "Admin"),
        allowNull: false,
        defaultValue: "User",
      },
    },
    {
      timestamps: false,
    }
  );

  return User;
};