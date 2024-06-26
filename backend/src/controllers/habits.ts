import { Express } from "express";
import { Api } from "../lib/api";

import { Activity, Habit, TrackedActivity } from "../models/habit";
import { ProjectActivityCache } from "../models/projectactivitycache";
import { Op } from "sequelize";

import { isLoggedInMiddleware } from "./auth";
import catchAsync from "../lib/catchAsync";

export default function (app: Express) {
  app.get<{}, Api.Habits.type>(
    Api.Habits.path,
    isLoggedInMiddleware,
    catchAsync(async (req, res) => {
      const result: Api.Habits.type = [];
      const habits = await Habit.findAll({
        where: {
          ownerId: req.session.passport!.user.id,
          archived: false,
        },
        order: [[Habit.getAttributes().sortIndex.field!, "ASC"]],
      });

      for (const habit of habits) {
        const periodStart = new Date();
        periodStart.setDate(periodStart.getDate() - habit.periodLength);
        const historyStart = new Date();
        historyStart.setDate(historyStart.getDate() - habit.historyLength);

        const trackedInPeriod = await TrackedActivity.getSummarized({
          ownerId: req.session.passport!.user.id,
          HabitId: habit.id,
          createdAt: { [Op.gt]: periodStart },
        });

        const trackedInHistory = await TrackedActivity.getSummarized({
          ownerId: req.session.passport!.user.id,
          HabitId: habit.id,
          createdAt: { [Op.gt]: historyStart },
        });

        const historicalPercent = Math.min(
          Math.round(
            (trackedInHistory.sumValue / habit.targetValue) *
              (habit.periodLength / habit.historyLength) *
              100
          ),
          100
        );

        result.push({
          id: habit.id,
          name: habit.name,
          type: habit.type,
          iconName: habit.iconName,
          value: trackedInPeriod.sumValue,
          targetValue: habit.targetValue,
          historicalPercent,
        });
      }

      res.send(result);
    })
  );

  app.get<Api.Habit.get_params, Api.Habit.type>(
    Api.Habit.path,
    isLoggedInMiddleware,
    catchAsync(async (req, res) => {
      const habit = await Habit.findOne({
        where: {
          id: req.params.id,
          archived: false,
        },
        include: [
          {
            association: Activity.tableName,
            include: [
              {
                // get last tracked activity for each activity creation time (for sorting)
                association: TrackedActivity.tableName,
                attributes: [TrackedActivity.getAttributes().createdAt.field!],
                limit: 1,
                order: [
                  [TrackedActivity.getAttributes().createdAt.field!, "DESC"],
                ],
              },
            ],
          },
        ],
      });

      if (habit) {
        const periodStart = new Date();
        periodStart.setDate(periodStart.getDate() - habit.periodLength);
        const historyStart = new Date();
        historyStart.setDate(historyStart.getDate() - habit.historyLength);

        const trackedInPeriod = await TrackedActivity.getSummarized({
          ownerId: req.session.passport!.user.id,
          HabitId: habit.id,
          createdAt: { [Op.gt]: periodStart },
        });

        const trackedInHistory = await TrackedActivity.findAll({
          where: {
            ownerId: req.session.passport!.user.id,
            HabitId: habit.id,
            createdAt: { [Op.gt]: historyStart },
          },
          order: [
            [TrackedActivity.getAttributes().createdAt.field!, "DESC"],
            [TrackedActivity.getAttributes().updatedAt.field!, "DESC"],
          ],
          include: [Activity, ProjectActivityCache],
        });

        res.send({
          name: habit.name,
          type: habit.type,
          iconName: habit.iconName,
          targetValue: habit.targetValue,
          periodLength: habit.periodLength,
          historyLength: habit.historyLength,
          trackedInPeriod: {
            count: trackedInPeriod.count,
            value: trackedInPeriod.sumValue,
          },
          activities: habit.Activities
            ? habit.Activities.map((activity) => ({
                id: activity.id,
                name: activity.name,
                value: activity.value,
                lastTracked: activity.TrackedActivities?.length
                  ? activity.TrackedActivities[0].createdAt
                  : new Date(0),
              }))
                .sort(
                  (a, b) => b.lastTracked.getTime() - a.lastTracked.getTime()
                )
                .map((activity) => ({
                  ...activity,
                  lastTracked: activity.lastTracked.toISOString(),
                }))
            : [],
          history: await Promise.all(
            trackedInHistory.map(async (item) => ({
              id: item.id,
              activityName: item.Activity!.name,
              value: item.Activity!.value,
              date: item.createdAt.toISOString(),
              project: item.ProjectActivityCache
                ? (await item.ProjectActivityCache.activity()) ?? undefined
                : undefined,
            }))
          ),
        });
      } else {
        res.sendStatus(404);
      }
    })
  );

  app.post<{}, Api.Habit.Track.post_resp, Api.Habit.Track.post_type>(
    Api.Habit.Track.path,
    isLoggedInMiddleware,
    catchAsync(async (req, res) => {
      const activity = await Activity.findOne({
        where: {
          id: req.body.activityId,
          ownerId: req.session.passport!.user.id,
        },
      });
      if (activity) {
        const record = await TrackedActivity.create({
          ownerId: req.session.passport!.user.id,
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
    })
  );

  app.delete<Api.Habit.Track.deleteParams>(
    Api.Habit.Track.pathWithId,
    isLoggedInMiddleware,
    catchAsync(async (req, res) => {
      await TrackedActivity.destroy({
        where: {
          id: req.params.id,
          ownerId: req.session.passport!.user.id,
        },
      });
      res.sendStatus(200);
    })
  );
}
