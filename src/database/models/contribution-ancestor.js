('use strict')
module.exports = (sequelize, DataTypes) => {
  const Ancestor = sequelize.define(
    'mmContributionsancestors',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      mmContributionId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ancestorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('NOW')
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    },
    {
      tableName: 'mmContributionsancestors',
      underscored: false,
      updatedAt: false,
      createdAt: false
    }
  )

  return Ancestor
}
