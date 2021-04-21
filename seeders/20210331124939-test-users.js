'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'aaa',
          email: 'taro@example.com',
          password: 'taro-password',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'bbb',
          email: 'jiro@example.com',
          password: 'jiro-password',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'ccc',
          email: 'saburo@example.com',
          password: 'saburo-password',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'ddd',
          email: 'shiro@example.com',
          password: 'shiro-password',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'eee',
          email: 'goro@example.com',
          password: 'goro-password',
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
