const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Attendance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late'),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  });
};