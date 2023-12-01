import { Express } from "express";
import { Api } from "../lib/api";

import db, { Activity, Habit, TrackedActivity } from "../lib/db";
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
        include: [Activity],
      });
      if (habit) {
        const periodStart = new Date();
        periodStart.setDate(periodStart.getDate() - habit.periodLength);
        const historyStart = new Date();
        historyStart.setDate(historyStart.getDate() - habit.historyLength);

        const trackedInPeriod = await TrackedActivity.getSummarized({
          ownerId: USER_ID,
          HabitId: habit.id,
          createdAt: { [Op.gt]: periodStart },
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
          include: [Activity],
        });

        res.send({
          name: habit.name,
          iconName: habit.iconName,
          targetValue: habit.targetValue,
          periodLength: habit.periodLength,
          historyLength: habit.historyLength,
          trackedInPeriod: {
            count: trackedInPeriod.count,
            value: trackedInPeriod.sumValue,
          },
          activities: habit.Activities
            ? habit.Activities.sort((a, b) => b.value - a.value).map(
                (activity) => ({
                  id: activity.id,
                  name: activity.name,
                })
              )
            : [],
          history: trackedInHistory.map((item) => ({
            id: item.id,
            activityName: item.Activity!.name,
            value: item.Activity!.value,
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
      const activity = await Activity.findOne({
        where: {
          id: req.body.activityId,
          ownerId: USER_ID,
        },
      });
      if (activity) {
        const record = await TrackedActivity.create({
          ownerId: USER_ID,
          ActivityId: activity.id,
          HabitId: activity.HabitId,
          createdAt: new Date(req.body.date),
        });
        res.send({
          id: record.id,
        });
      } else {
        res.sendStatus(400);
      }
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
