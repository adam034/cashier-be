'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('CSH_TB_M_PROFILES', {
      fields: ['USERS_ID'],
      type: 'foreign key',
      name: 'CSH_TB_M_PROFILES_USERS_ID_fkey',
      references: {
          table: 'CSH_TB_M_USERS',
          field: 'ID'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('CSH_TB_M_PROFILES', 'USERS_ID');
    await queryInterface.removeConstraint('CSH_TB_M_PROFILES', 'CSH_TB_M_PROFILES_USERS_ID_fkey')
  }
};
