'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Players-names', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      players-name: {
        type: Sequelize.STRING
      },
      sports-name: {
        type: Sequelize.STRING
      },
      session-Id: {
        type: Sequelize.INTEGER
      },
      total-player: {
        type: Sequelize.INTEGER
      },
      uploader-Id: {
        type: Sequelize.STRING
      },
      my-name: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Players-names');
  }
};
