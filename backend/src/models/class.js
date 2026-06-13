const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Class', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.UUID,
    },
    description: {
      type: DataTypes.TEXT,
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },
  });
};