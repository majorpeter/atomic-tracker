import { Express } from "express";
import { Api } from "../lib/api";
import db, { Habit } from "../lib/db";
import { Op } from "sequelize";

//TODO multiuser support
const USER_ID = 0;

export default function (app: Express) {
  app.get<{}, Api.Config.Habits.get_type>(
    Api.Config.Habits.path,
    async (_, res) => {
      const habits = await Habit.findAll({
        where: {
          ownerId: USER_ID,
          archived: false,
        },
        order: [[Habit.getAttributes().sortIndex.field!, "ASC"]],
      });
      const archived = await Habit.findAll({
        where: {
          ownerId: USER_ID,
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
    async (req, res) => {
      if (req.body.action == "add") {
        const maxSortIndex = (await Habit.aggregate(
          "sortIndex",
          "MAX"
        )) as number;

        await Habit.create({
          ...req.body.habit,
          ownerId: USER_ID,
          sortIndex: maxSortIndex + 1,
        });
        res.sendStatus(200);
      } else if (req.body.action == "edit") {
        const habit = await Habit.findOne({
          where: { id: req.body.habit.id, ownerId: USER_ID },
        });
        if (habit) {
          const { id, ...input } = req.body.habit;
          habit.setAttributes(input);
          habit.save();
          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
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
            where: { id: id, ownerId: USER_ID, archived: false },
          });
          if (!item) {
            return false;
          } else {
            let other;
            if (direction == "up") {
              other = await Habit.findOne({
                where: {
                  sortIndex: { [Op.lt]: item.sortIndex },
                  ownerId: USER_ID,
                  archived: false,
                },
                order: [[Habit.getAttributes().sortIndex.field!, "DESC"]],
              });
            } else if (direction == "down") {
              other = await Habit.findOne({
                where: {
                  sortIndex: { [Op.gt]: item.sortIndex },
                  ownerId: USER_ID,
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
      } else {
        res.sendStatus(400);
      }
    }
  );
}
