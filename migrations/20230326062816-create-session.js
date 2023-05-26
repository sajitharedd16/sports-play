'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Create_sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      session_des: {
        type: Sequelize.STRING
      },
      session_date: {
        type: Sequelize.DATEONLY
      },
      uploader_id: {
        type: Sequelize.STRING
      },
      sports_title: {
        type: Sequelize.STRING
      },
      total_players: {
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      add_player:{
        allowNull:true,
        type: Sequelize.INTEGER
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Create_sessions');
  }
};
