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
        iconName: "workout",
        targetValue: 5,
        periodLength: 7,
        historyLength: 14,
        ownerId: USER,
        sortIndex: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Reading",
        iconName: "book",
        targetValue: 2,
        periodLength: 7,
        historyLength: 10,
        ownerId: USER,
        sortIndex: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Write Journal",
        iconName: "journal",
        targetValue: 7,
        periodLength: 7,
        historyLength: 7,
        ownerId: USER,
        sortIndex: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Meditate",
        iconName: "selfImprovement",
        targetValue: 7,
        periodLength: 7,
        historyLength: 7,
        ownerId: USER,
        sortIndex: 4,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("Activities", [
      {
        name: "Light workout",
        value: 1,
        ownerId: USER,
        HabitId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Running 5k",
        value: 3,
        ownerId: USER,
        HabitId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Reading",
        value: 1,
        ownerId: USER,
        HabitId: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Daily Journal",
        value: 1,
        ownerId: USER,
        HabitId: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Morning 5 min",
        value: 1,
        ownerId: USER,
        HabitId: 4,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert("TrackedActivities", [
      {
        ownerId: USER,
        ActivityId: 1,
        HabitId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        ownerId: USER,
        ActivityId: 2,
        HabitId: 1,
        createdAt: day1_before,
        updatedAt: now,
      },
      {
        ownerId: USER,
        ActivityId: 1,
        HabitId: 1,
        createdAt: day2_before,
        updatedAt: now,
      },

      {
        ownerId: USER,
        ActivityId: 3,
        HabitId: 2,
        createdAt: day2_before,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Habits", null, {});
  },
};
