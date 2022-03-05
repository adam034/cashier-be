'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('CSH_TB_M_STATUS', {
      ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TYPE: {
        type: Sequelize.STRING,
      },
      CODE: {
        type: Sequelize.STRING
      },
      DESC: {
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
    return queryInterface.dropTable('CSH_TB_M_STATUS');
  }
};
