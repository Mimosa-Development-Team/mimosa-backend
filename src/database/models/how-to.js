'use strict'
module.exports = (sequelize, DataTypes) => {
  const HowTo = sequelize.define('mmHowto', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: true
    },
    question: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shortDetails: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fullDetails: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    }
  }, {
    tableName: 'mmHowto',
    underscored: false
  })

  HowTo.getFAQ = () => {
    const query = 'SELECT * FROM get_faq()'

    return sequelize.query(query, { raw: true })
  }

  HowTo.getSearchFAQ = searchQuestion => {
    const query = `SELECT * FROM get_search_faq('${searchQuestion}')`

    return sequelize.query(query, { raw: true })
  }

  return HowTo
}
