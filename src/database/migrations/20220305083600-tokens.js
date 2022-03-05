'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('CSH_TB_R_TOKEN', {
      ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      USER_ID: {
        type: Sequelize.INTEGER,
      },
      TOKEN: {
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
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('CSH_TB_R_TOKEN');
  }
};
