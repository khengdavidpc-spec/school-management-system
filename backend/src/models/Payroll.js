const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Payroll', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Teachers', key: 'id' },
      onDelete: 'CASCADE',
    },
    baseSalary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    month: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    overtimeHours: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    overtimeRate: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 1.5,
    },
    deductions: {
      type: DataTypes.JSON,
      defaultValue: { taxes: 0, insurance: 0, loans: 0, other: 0 },
    },
    status: {
      type: DataTypes.ENUM('pending', 'processed', 'paid', 'cancelled'),
      defaultValue: 'pending',
    },
    grossSalary: {
      type: DataTypes.DECIMAL(12, 2),
    },
    totalDeductions: {
      type: DataTypes.DECIMAL(12, 2),
    },
    netSalary: {
      type: DataTypes.DECIMAL(12, 2),
    },
    processedAt: {
      type: DataTypes.DATE,
    },
    paidAt: {
      type: DataTypes.DATE,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  });
};
