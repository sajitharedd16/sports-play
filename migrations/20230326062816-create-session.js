'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Create-sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      session-des: {
        type: Sequelize.STRING
      },
      session-date: {
        type: Sequelize.DATEONLY
      },
      uploader-id: {
        type: Sequelize.STRING
      },
      sports-title: {
        type: Sequelize.STRING
      },
      total-players: {
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.STRING
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      add-player:{
        allowNull:true,
        type: Sequelize.INTEGER
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Create-sessions');
  }
};
