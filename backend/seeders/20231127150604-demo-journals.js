"use strict";

function dateToNumber(date) {
  const value = date.toJSON();
  return parseInt(
    value.substring(0, 4) + value.substring(5, 7) + value.substring(8, 10)
  );
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const today = new Date();
    const day1_before = new Date(today);
    day1_before.setDate(day1_before.getDate() - 1);
    const day2_before = new Date(today);
    day2_before.setDate(day1_before.getDate() - 1);

    await queryInterface.bulkInsert("Journals", [
      {
        date: dateToNumber(day2_before),
        content: "Dummy text for 2 days ago",
        count: 1,
        ownerId: 0,
        createdAt: day2_before,
        updatedAt: day2_before,
      },
      {
        date: dateToNumber(day1_before),
        content: "Dummy content for yesterday\n2nd line",
        count: 2,
        ownerId: 0,
        createdAt: day1_before,
        updatedAt: day1_before,
      },
      {
        date: dateToNumber(today),
        content:
          "I saw a cute dog today\nhad lunch with a friend\nwatched the latest episode of my show\nwalk in the park",
        count: 4,
        ownerId: 0,
        createdAt: today,
        updatedAt: today,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Journals", null, {});
  },
};
