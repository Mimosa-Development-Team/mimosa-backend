'use strict'
module.exports = (sequelize, DataTypes) => {
  const ContributionRelation = sequelize.define('mmContributionRelation', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    contribParentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contribChildId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parentQuestionUuid: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'mmContributionRelation',
    underscored: false
  })

  return ContributionRelation
}
