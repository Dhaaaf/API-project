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
        url: "https://static.wikia.nocookie.net/lotr/images/e/e3/Lonely_Mountain_-_DoS.jpg/revision/latest?cb=20200317224945",
        preview: true
      },
      {
        spotId: 2,
        url: "https://i.imgur.com/WHhQJhE.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://static.wikia.nocookie.net/middle-earth-film-saga/images/b/b6/Vlcsnap-2013-05-19-19h49m07s0_%281%29.png/revision/latest?cb=20190731030519",
        preview: true
      },
      {
        spotId: 4,
        url: "https://images.alphacoders.com/117/1173574.jpg",
        preview: true
      },
      {
        spotId: 5,
        url: "https://bigshinyrobot.com/wp-content/uploads/2016/12/helms-deep-1568x909.jpg",
        preview: true
      },
      {
        spotId: 6,
        url: "https://assets.vogue.com/photos/598dacb5f0b0e21484d342ba/master/w_2560%2Cc_limit/00-lede-a-game-of-thrones-guide-to-dubrovnik-croatia.jpg",
        preview: true
      },
      {
        spotId: 7,
        url: "https://media1.popsugar-assets.com/files/thumbor/pactm7otyE_OxTCBtASoul3khBk/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2022/08/29/048/n/44498184/9086fe5a0498866b__13_courtesyofhbo_13357/i/Dragonstone.jpg",
        preview: true
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
