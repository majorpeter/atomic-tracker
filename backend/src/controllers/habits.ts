import { Express } from "express";
import { Api } from "../lib/api";

import { Habit, TrackedHabit } from "../lib/db";
import { Op } from "sequelize";

//TODO multiuser support
const USER_ID = 0;

export default function (app: Express) {
  app.get<{}, Api.Habits.type>(Api.Habits.path, async (_, res) => {
    const result: Api.Habits.type = [];
    const habits = await Habit.findAll({ where: { ownerId: USER_ID } });

    for (const h of habits) {
      const periodStart = new Date();
      periodStart.setDate(periodStart.getDate() - h.periodLength);
      const historyStart = new Date();
      historyStart.setDate(periodStart.getDate() - h.historyLength);

      const trackedInPeriod = (
        await TrackedHabit.findAll({
          where: {
            ownerId: USER_ID,
            HabitId: h.id,
            createdAt: { [Op.gt]: periodStart },
          },
        })
      ).length;

      const trackedInHistory = (
        await TrackedHabit.findAll({
          where: {
            ownerId: USER_ID,
            HabitId: h.id,
            createdAt: { [Op.gt]: historyStart },
          },
        })
      ).length;

      const historicalPercent = Math.round(
        (trackedInHistory / h.targetValue) *
          (h.periodLength / h.historyLength) *
          100
      );

      result.push({
        name: h.name,
        value: trackedInPeriod,
        targetValue: h.targetValue,
        historicalPercent,
      });
    }

    res.send(result);
  });
}
