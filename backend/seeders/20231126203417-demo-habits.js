"use strict";

const USER = 0;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const day1_before = new Date();
    day1_before.setDate(day1_before.getDate() - 1);
    const day2_before = new Date();
    day2_before.setDate(day1_before.getDate() - 2);

    await queryInterface.bulkInsert("Habits", [
      {
        name: "Workout",
        targetValue: 5,
        periodLength: 7,
        historyLength: 14,
        ownerId: USER,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Reading",
        targetValue: 2,
        periodLength: 7,
        historyLength: 10,
        ownerId: USER,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Write Journal",
        targetValue: 7,
        periodLength: 7,
        historyLength: 7,
        ownerId: USER,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Meditate",
        targetValue: 7,
        periodLength: 7,
        historyLength: 7,
        ownerId: USER,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("TrackedHabits", [
      { ownerId: USER, HabitId: 1, createdAt: now, updatedAt: now },
      { ownerId: USER, HabitId: 1, createdAt: day1_before, updatedAt: now },
      { ownerId: USER, HabitId: 1, createdAt: day2_before, updatedAt: now },

      { ownerId: USER, HabitId: 2, createdAt: day2_before, updatedAt: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Habits", null, {});
  },
};
