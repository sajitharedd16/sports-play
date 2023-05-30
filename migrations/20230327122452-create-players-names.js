'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Players_names', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      players_name: {
        type: Sequelize.STRING
      },
      sports_name: {
        type: Sequelize.STRING
      },
      session_id: {
        type: Sequelize.INTEGER
      },
      total_player: {
        type: Sequelize.INTEGER
      },
      uploader_id: {
        type: Sequelize.STRING
      },
      my_name: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Players_names');
  }
};
