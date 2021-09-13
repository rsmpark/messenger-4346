const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL || 'messenger', 'postgres', 'park-sang', {
  logging: false,
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = db;
