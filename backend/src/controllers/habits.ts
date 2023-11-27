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
        id: h.id,
        name: h.name,
        value: trackedInPeriod,
        targetValue: h.targetValue,
        historicalPercent,
      });
    }

    res.send(result);
  });

  app.get<Api.Habit.get_params, Api.Habit.type>(
    Api.Habit.path,
    async (req, res) => {
      const habit = await Habit.findOne({ where: { id: req.params.id } });
      if (habit) {
        const periodStart = new Date();
        periodStart.setDate(periodStart.getDate() - habit.periodLength);
        const historyStart = new Date();
        historyStart.setDate(periodStart.getDate() - habit.historyLength);

        const trackedInPeriod = await TrackedHabit.count({
          where: {
            ownerId: USER_ID,
            HabitId: habit.id,
            createdAt: { [Op.gt]: periodStart },
          },
        });

        const trackedInHistory = await TrackedHabit.findAll({
          where: {
            ownerId: USER_ID,
            HabitId: habit.id,
            createdAt: { [Op.gt]: historyStart },
          },
          order: [[TrackedHabit.getAttributes().createdAt.field!, "DESC"]],
        });

        res.send({
          name: habit.name,
          targetValue: habit.targetValue,
          periodLength: habit.periodLength,
          historyLength: habit.historyLength,
          trackedInPeriod,
          history: trackedInHistory.map((item) => ({
            date: item.createdAt.toISOString(),
          })),
        });
      } else {
        res.sendStatus(404);
      }
    }
  );
}
