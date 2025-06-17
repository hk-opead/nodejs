const sequelize = require("./User").sequelize;
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT, // TEXT might be better for longer descriptions
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT, // TEXT might be better for longer descriptions
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "project",
  }
);

module.exports = { Project };
