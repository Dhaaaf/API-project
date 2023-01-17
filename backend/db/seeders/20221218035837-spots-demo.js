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
        name: 'Lonely Mountain',
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
        ownerId: 2,
        address: '222 Rivendell',
        city: 'Rivendell',
        state: 'Rivendell',
        country: 'Middle Earth',
        lat: 22.31,
        lng: 55.66,
        name: 'Elf house',
        description: 'Elronds place',
        price: 699,
      },
      {
        ownerId: 2,
        address: '22 Helms Deep',
        city: 'Helms Deep',
        state: 'Rohan',
        country: 'Middle Earth',
        lat: 22.22,
        lng: 22.22,
        name: 'Helms Deep',
        description: 'Fortress for man-kind',
        price: 649,
      },
      {
        ownerId: 3,
        address: '11 Kings Landing',
        city: 'Kings Landing',
        state: 'Capital',
        country: 'Westeros',
        lat: 89.89,
        lng: 47.22,
        name: 'Kings Landing',
        description: 'Only place fit for a King',
        price: 649,
      },
      {
        ownerId: 1,
        address: '33 Dragon Stone',
        city: 'Dragonstone',
        state: 'Blackwater Bay',
        country: 'Westeros',
        lat: 33.89,
        lng: 47.22,
        name: 'Dragonstone',
        description: 'Come to see Dragons',
        price: 3000,
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
