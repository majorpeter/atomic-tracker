import { Express } from "express";
import { Api } from "../lib/api";
import { Op } from "sequelize";
import { isLoggedInMiddleware } from "./auth";

import { Habit, Activity } from "../models/habit";
import { Integration } from "../models/integration";
import db from "../lib/db";

export default function (app: Express) {
  app.get<{}, Api.Config.Habits.get_type>(
    Api.Config.Habits.path,
    isLoggedInMiddleware,
    async (req, res) => {
      const habits = await Habit.findAll({
        where: {
          ownerId: req.session.userId!,
          archived: false,
        },
        include: [Activity],
        order: [[Habit.getAttributes().sortIndex.field!, "ASC"]],
      });
      const archived = await Habit.findAll({
        where: {
          ownerId: req.session.userId!,
          archived: true,
        },
      });

      res.send({
        habits: habits.map((item) => ({
          id: item.id,
          name: item.name,
          iconName: item.iconName,
          targetValue: item.targetValue,
          periodLength: item.periodLength,
          historyLength: item.historyLength,
          activities: item
            .Activities!.filter((a) => !a.archived)
            .sort((a, b) => b.value - a.value)
            .map((a) => ({
              id: a.id,
              name: a.name,
              value: a.value,
            })),
          archivedActivites: item
            .Activities!.filter((a) => a.archived)
            .map((a) => ({
              id: a.id,
              name: a.name,
            })),
        })),
        archived: archived.map((item) => ({
          id: item.id,
          name: item.name,
        })),
      });
    }
  );

  app.post<{}, {}, Api.Config.Habits.post_type>(
    Api.Config.Habits.path,
    isLoggedInMiddleware,
    async (req, res) => {
      if (req.body.action == "add") {
        const { activities, archivedActivites: _, ...habit } = req.body.habit;

        await db.transaction(async () => {
          const maxSortIndex = (await Habit.aggregate(
            "sortIndex",
            "MAX"
          )) as number;

          const h = await Habit.create({
            ...habit,
            ownerId: req.session.userId!,
            sortIndex: maxSortIndex + 1,
          });

          for (const a of activities) {
            await Activity.create({
              name: a.name,
              value: a.value,
              HabitId: h.id,
              ownerId: req.session.userId!,
            });
          }

          // archived activities cannot be created
        });

        res.sendStatus(200);
      } else if (req.body.action == "edit") {
        const { id, activities, archivedActivites, ...input } = req.body.habit;

        const statusCode = await db.transaction(async () => {
          const habit = await Habit.findOne({
            where: { id: id, ownerId: req.session.userId! },
          });
          if (!habit) {
            return 404;
          }

          habit.setAttributes(input);
          habit.save();

          const storedActivites = await habit.getActivities();

          // update non-archived items
          for (const activity of activities.filter((a) => a.id !== undefined)) {
            const stored = storedActivites.find((s) => s.id === activity.id);
            stored!.setAttributes({
              name: activity.name,
              value: activity.value,
              archived: false,
            });
            stored!.save();
          }

          // update archived
          for (const activity of archivedActivites) {
            const stored = storedActivites.find((s) => s.id === activity.id);
            stored!.setAttributes({
              archived: true,
            });
            stored?.save();
          }

          // create new activities if any
          for (const activity of activities.filter((a) => a.id === undefined)) {
            await Activity.create({
              name: activity.name,
              value: activity.value,
              HabitId: id,
              ownerId: req.session.userId!,
            });
          }

          // delete deleted
          for (const activity of storedActivites.filter((activity) => {
            if (activities.find((a) => a.id === activity.id)) {
              return false;
            }
            if (archivedActivites.find((a) => a.id === activity.id)) {
              return false;
            }
            return true;
          })) {
            await activity.destroy();
          }

          return 200;
        });
        res.sendStatus(statusCode);
      } else if (req.body.action == "archive") {
        const habit = await Habit.findOne({ where: { id: req.body.id } });
        if (habit) {
          habit.archived = true;
          await habit.save();
          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
      } else if (req.body.action == "unarchive") {
        const habit = await Habit.findOne({ where: { id: req.body.id } });
        if (habit) {
          habit.archived = false;
          await habit.save();
          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
      } else if (req.body.action == "move") {
        const { id, direction } = req.body;
        await db.transaction<boolean>(async () => {
          const item = await Habit.findOne({
            where: { id: id, ownerId: req.session.userId!, archived: false },
          });
          if (!item) {
            return false;
          } else {
            let other;
            if (direction == "up") {
              other = await Habit.findOne({
                where: {
                  sortIndex: { [Op.lt]: item.sortIndex },
                  ownerId: req.session.userId!,
                  archived: false,
                },
                order: [[Habit.getAttributes().sortIndex.field!, "DESC"]],
              });
            } else if (direction == "down") {
              other = await Habit.findOne({
                where: {
                  sortIndex: { [Op.gt]: item.sortIndex },
                  ownerId: req.session.userId!,
                  archived: false,
                },
                order: [[Habit.getAttributes().sortIndex.field!, "ASC"]],
              });
            }

            if (!other) {
              return false;
            }

            const otherIndex = other.sortIndex;
            other.sortIndex = item.sortIndex;
            await other.save();
            item.sortIndex = otherIndex;
            await item.save();

            return true;
          }
        });
        res.send(200);
      } else if (req.body.action == "delete") {
        const h = await Habit.findOne({
          where: {
            id: req.body.id,
            ownerId: req.session.userId!,
          },
        });
        if (h) {
          await h.destroy();
          res.send(200);
        } else {
          res.send(404);
        }
      } else {
        res.sendStatus(400);
      }
    }
  );

  app.get<{}, Api.Config.Todos.type>(
    Api.Config.Todos.path,
    isLoggedInMiddleware,
    async (req, res) => {
      const int = await Integration.findOne({
        where: {
          ownerId: req.session.userId!,
        },
      });
      if (int) {
        res.send(int.Todos);
      } else {
        res.sendStatus(404);
      }
    }
  );

  app.post<{}, {}, Api.Config.Todos.type>(
    Api.Config.Todos.path,
    isLoggedInMiddleware,
    async (req, res) => {
      const int = await Integration.findOne({
        where: {
          ownerId: req.session.userId!,
        },
      });

      if (int) {
        int.Todos = req.body;
        await int.save();
      } else {
        await Integration.create({
          Todos: req.body,
          ownerId: req.session.userId!,
        });
      }

      res.sendStatus(200);
    }
  );

  app.get<{}, Api.Config.Projects.type>(
    Api.Config.Projects.path,
    isLoggedInMiddleware,
    async (req, res) => {
      const int = await Integration.findOne({
        where: {
          ownerId: req.session.userId!,
        },
      });
      if (int) {
        res.send(int.Projects);
      } else {
        res.sendStatus(404);
      }
    }
  );

  app.post<{}, {}, Api.Config.Projects.type>(
    Api.Config.Projects.path,
    isLoggedInMiddleware,
    async (req, res) => {
      const int = await Integration.findOne({
        where: {
          ownerId: req.session.userId!,
        },
      });

      if (int) {
        int.Projects = req.body;
        await int.save();
      } else {
        await Integration.create({
          Projects: req.body,
          ownerId: req.session.userId!,
        });
      }

      res.sendStatus(200);
    }
  );
}
