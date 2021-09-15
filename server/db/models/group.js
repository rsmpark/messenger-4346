const Sequelize = require('sequelize');
const db = require('../db');

const Group = db.define('group', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = Group;
