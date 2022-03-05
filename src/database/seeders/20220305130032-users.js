'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    const date = new Date();
    const users = await queryInterface.bulkInsert(
      'CSH_TB_M_USERS',
      [
        {
          USERNAME: 'admin',
          PASSWORD: bcrypt.hashSync('admin',10),
          ROLE: 1,
          IS_ACTIVE: true,
          createdAt: date,
          updatedAt: date
        }
      ],
      {
        returning: true
      }
    )
    const [admin] = users
    const profiles = await queryInterface.bulkInsert(
      'CSH_TB_M_PROFILES',
      [
        {
          USERS_ID: admin.ID,
          FULL_NAME: 'Admin',
          ADDRESS: 'Jln Gajah Mada',
          PHONE: '08828282828',
          PHOTO: 'image',
          createdAt: date,
          updatedAt: date
        }
      ]
    )
    console.debug(`user created ${users.length}`)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CSH_TB_M_USERS');
    await queryInterface.bulkDelete('CSH_TB_M_PROFILES');
  }
};
