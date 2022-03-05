'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('CSH_TB_M_USERS', {
      ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      USERNAME: {
        type: Sequelize.STRING,
        unique: true
      },
      PASSWORD: {
        type: Sequelize.STRING
      },
      ROLE: {
        type: Sequelize.INTEGER,
      },
      IS_ACTIVE: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    return queryInterface.dropTable('CSH_TB_M_USERS');
  }
};
