'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('CSH_TB_M_ITEMS', {
      ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CATEGORY_ID: {
        type: Sequelize.INTEGER
      },
      NAME: {
        type: Sequelize.STRING,
      },
      PRICE: {
        type: Sequelize.INTEGER,
      },
      DESC: {
        type: Sequelize.TEXT
      },
      PHOTO: {
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
    return queryInterface.dropTable('CSH_TB_M_ITEMS');
  }
};
