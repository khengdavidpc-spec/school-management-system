const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Grade', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    studentId:  { type: DataTypes.UUID, allowNull: false },
    classId:    { type: DataTypes.UUID },
    subject:    { type: DataTypes.STRING, allowNull: false },
    score:      { type: DataTypes.FLOAT, allowNull: false },
    grade:      { type: DataTypes.STRING },
    term:       { type: DataTypes.STRING, defaultValue: 'Term 1' },
    notes:      { type: DataTypes.TEXT },
  });
};
