'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

options.tableName = 'SpotImages';

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
        spotId: 1,
        url: "https://static.onecms.io/wp-content/uploads/sites/6/2014/12/hobbit-3_612x380_1.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "https://i.imgur.com/WHhQJhE.jpg",
        preview: false
      },
      {
        spotId: 3,
        url: "https://static.wikia.nocookie.net/middle-earth-film-saga/images/b/b6/Vlcsnap-2013-05-19-19h49m07s0_%281%29.png/revision/latest?cb=20190731030519",
        preview: false
      },
      {
        spotId: 4,
        url: "https://static.wikia.nocookie.net/middlearthfilmseries/images/8/8c/EreborThroneRoom.jpg/revision/latest?cb=20171003005845",
        preview: false
      }
    ], {})
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
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }), {}
  }
};
