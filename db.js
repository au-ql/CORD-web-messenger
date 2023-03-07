var { Sequelize, DataTypes, Model } = require("sequelize");

var sequelize = new Sequelize("Cord", "trupti", "test", {
  host: "localhost",
  dialect: "postgres",
});

async function auth() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
auth();
class User extends Model {}

User.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
  }
);

sequelize.sync({ alter: true });
console.log("The table for the User model was just (re)created!");

module.exports = User;
