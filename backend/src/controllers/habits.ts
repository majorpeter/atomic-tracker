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

    for (const habit of habits) {
      const periodStart = new Date();
      periodStart.setDate(periodStart.getDate() - habit.periodLength);
      const historyStart = new Date();
      historyStart.setDate(periodStart.getDate() - habit.historyLength);

      const trackedInPeriod = (
        await TrackedHabit.findAll({
          where: {
            ownerId: USER_ID,
            HabitId: habit.id,
            createdAt: { [Op.gt]: periodStart },
          },
        })
      ).length;

      const trackedInHistory = (
        await TrackedHabit.findAll({
          where: {
            ownerId: USER_ID,
            HabitId: habit.id,
            createdAt: { [Op.gt]: historyStart },
          },
        })
      ).length;

      const historicalPercent = Math.round(
        (trackedInHistory / habit.targetValue) *
          (habit.periodLength / habit.historyLength) *
          100
      );

      result.push({
        id: habit.id,
        name: habit.name,
        iconName: habit.iconName,
        value: trackedInPeriod,
        targetValue: habit.targetValue,
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
          order: [
            [TrackedHabit.getAttributes().createdAt.field!, "DESC"],
            [TrackedHabit.getAttributes().updatedAt.field!, "DESC"],
          ],
        });

        res.send({
          name: habit.name,
          iconName: habit.iconName,
          targetValue: habit.targetValue,
          periodLength: habit.periodLength,
          historyLength: habit.historyLength,
          trackedInPeriod,
          history: trackedInHistory.map((item) => ({
            id: item.id,
            date: item.createdAt.toISOString(),
          })),
        });
      } else {
        res.sendStatus(404);
      }
    }
  );

  app.post<{}, Api.Habit.Track.post_resp, Api.Habit.Track.post_type>(
    Api.Habit.Track.path,
    async (req, res) => {
      const record = await TrackedHabit.create({
        ownerId: USER_ID,
        HabitId: req.body.habitId,
        createdAt: new Date(req.body.date),
      });
      res.send({
        id: record.id,
      });
    }
  );

  app.delete(Api.Habit.Track.pathWithId, async (req, res) => {
    await TrackedHabit.destroy({
      where: {
        id: req.params.id,
        ownerId: USER_ID,
      },
    });
    res.sendStatus(200);
  });
}
