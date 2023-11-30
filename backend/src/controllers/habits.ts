import { Express } from "express";
import { Api } from "../lib/api";

import { Habit, TrackedActivity } from "../lib/db";
import { Op } from "sequelize";

//TODO multiuser support
const USER_ID = 0;

export default function (app: Express) {
  app.get<{}, Api.Habits.type>(Api.Habits.path, async (_, res) => {
    const result: Api.Habits.type = [];
    const habits = await Habit.findAll({
      where: {
        ownerId: USER_ID,
        archived: false,
      },
      order: [[Habit.getAttributes().sortIndex.field!, "ASC"]],
    });

    for (const habit of habits) {
      const periodStart = new Date();
      periodStart.setDate(periodStart.getDate() - habit.periodLength);
      const historyStart = new Date();
      historyStart.setDate(periodStart.getDate() - habit.historyLength);

      const trackedInPeriod = (
        await TrackedActivity.findAll({
          where: {
            ownerId: USER_ID,
            HabitId: habit.id,
            createdAt: { [Op.gt]: periodStart },
          },
        })
      ).length;

      const trackedInHistory = (
        await TrackedActivity.findAll({
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
      const habit = await Habit.findOne({
        where: {
          id: req.params.id,
          archived: false,
        },
      });
      if (habit) {
        const periodStart = new Date();
        periodStart.setDate(periodStart.getDate() - habit.periodLength);
        const historyStart = new Date();
        historyStart.setDate(periodStart.getDate() - habit.historyLength);

        const trackedInPeriod = await TrackedActivity.count({
          where: {
            ownerId: USER_ID,
            HabitId: habit.id,
            createdAt: { [Op.gt]: periodStart },
          },
        });

        const trackedInHistory = await TrackedActivity.findAll({
          where: {
            ownerId: USER_ID,
            HabitId: habit.id,
            createdAt: { [Op.gt]: historyStart },
          },
          order: [
            [TrackedActivity.getAttributes().createdAt.field!, "DESC"],
            [TrackedActivity.getAttributes().updatedAt.field!, "DESC"],
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
      const record = await TrackedActivity.create({
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
    await TrackedActivity.destroy({
      where: {
        id: req.params.id,
        ownerId: USER_ID,
      },
    });
    res.sendStatus(200);
  });
}
