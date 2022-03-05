'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const date = new Date();
    const statuses = await queryInterface.bulkInsert(
      'CSH_TB_M_STATUS',
      [
        {
          TYPE: 'ROLE',
          CODE: 'R01',
          DESC: 'Admin',
          createdAt: date,
          updatedAt: date
        },
        {
          TYPE: 'ROLE',
          CODE: 'R02',
          DESC: 'Cashier',
          createdAt: date,
          updatedAt: date
        }
      ]
    )
    console.debug(`status created ${statuses.length}`)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CSH_TB_M_STATUS');
  }
};
