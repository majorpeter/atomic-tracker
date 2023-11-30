import { Express } from "express";
import { Api } from "../lib/api";
import { Habit } from "../lib/db";

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
        await Habit.create({
          ...req.body.habit,
          ownerId: USER_ID,
        });
        res.sendStatus(200);
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
      } else {
        res.sendStatus(400);
      }
    }
  );
}
