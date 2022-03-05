'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('CSH_TB_M_PROFILES', {
      ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      USERS_ID: {
        type: Sequelize.INTEGER,
      },
      FULL_NAME: {
        type: Sequelize.STRING,
      },
      ADDRESS: {
        type: Sequelize.TEXT
      },
      PHONE: {
        type: Sequelize.STRING,
      },
      PHOTO: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('CSH_TB_M_PROFILES');
  }
};
