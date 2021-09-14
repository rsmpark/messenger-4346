const Sequelize = require('sequelize');
const db = require('../db');

const Participant = db.define('participant', {
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = Participant;
