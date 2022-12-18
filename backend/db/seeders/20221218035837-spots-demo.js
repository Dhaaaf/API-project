'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Spots'

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '100 Lonely Mountain',
        city: 'Erebor',
        state: 'Dale',
        country: 'Middle Earth',
        lat: 11.11,
        lng: 22.22,
        name: 'Dwarven Treasure Hall',
        description: 'Experience being King Under the Mountain',
        price: 999,
      },
      {
        ownerId: 2,
        address: '64 Citadel',
        city: 'Minas Tirith',
        state: 'White Mountains',
        country: 'Middle Earth',
        lat: 99.99,
        lng: 88.88,
        name: 'Tower of Ecthelion',
        description: 'While here, you bow to no one',
        price: 790,
      },
      {
        ownerId: 3,
        address: '7 Bagshot Row',
        city: 'Hobbiton',
        state: 'The Shire',
        country: 'Middle Earth',
        lat: 31.01,
        lng: 21.01,
        name: 'Bag End',
        description: 'No better place to start your adventure',
        price: 111,
      },
      {
        ownerId: 1,
        address: '222 Lonely Mountain',
        city: 'Erebor',
        state: 'Dale',
        country: 'Middle Earth',
        lat: 22.31,
        lng: 55.66,
        name: 'Dwarven Throne Room',
        description: 'Feel like the King Under the Mountain',
        price: 699,
      },
    ], options)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      country: { [Op.in]: ['Middle Earth'] }
    }, {})
  }
};
